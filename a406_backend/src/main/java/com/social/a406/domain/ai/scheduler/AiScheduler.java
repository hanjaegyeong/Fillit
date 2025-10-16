package com.social.a406.domain.ai.scheduler;

import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.commentReply.service.ReplyService;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Date;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiScheduler {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ThreadPoolTaskScheduler taskScheduler;

    private final UserService userService;
    private final CommentService commentService;
    private final ReplyService replyService;
    private final BoardService boardService;

    private static final String AI_COMMENT_ENDPOINT = "/api/ai/generate/comment";
    private static final String RANDOM_AI_COMMENT_ENDPOINT = "/api/ai/generate/random/comment";
    private static final String AI_BOARD_ENDPOINT = "/api/ai/generate/random/board";
    private static final String AI_LIKE_ENDPOINT = "/api/ai/generate/like";
    private static final String RANDOM_AI_LIKE_ENDPOINT = "/api/ai/generate/random/like";
    private static final String AI_COMMENT_REPLY_ENDPOINT = "/api/ai/generate/reply";
    private static final String AI_FOLLOW_ENDPOINT = "/api/ai/generate/follow";
    private static final int MINUTE = 60000;

    @Value("${EC2_SERVER_URL}")
    private String ec2ServerUrl;

    @Scheduled(fixedDelay = 10 * MINUTE)
    public void generateAiBoard() {
        int delaySec = ThreadLocalRandom.current().nextInt(180, 420);
        Date startTime = Date.from(Instant.now().plusSeconds(delaySec));

        taskScheduler.schedule(() -> {
            try {
                String url = ec2ServerUrl + AI_BOARD_ENDPOINT;
                if (ThreadLocalRandom.current().nextInt(100) < 30) {
                    url += "?includeImage=true";
                }
                String response = restTemplate.getForObject(url, String.class);
                log.info("[AI 게시글 생성] 응답: {}", response);
            } catch (Exception e) {
                log.error("[AI 게시글 생성] 실패: {}", e.getMessage());
            }
        }, startTime);
    }

    @Scheduled(fixedDelay = 3 * MINUTE)
    public void generateAiComment() {
        int delaySec = ThreadLocalRandom.current().nextInt(180, 420);
        Date startTime = Date.from(Instant.now().plusSeconds(delaySec));

        taskScheduler.schedule(() -> {
            try {
                String response = restTemplate.getForObject(ec2ServerUrl
                        + RANDOM_AI_COMMENT_ENDPOINT, String.class);
                log.info("[AI 댓글 생성] 응답: {}", response);
            } catch (Exception e) {
                log.error("[AI 댓글 생성] 실패: {}", e.getMessage());
            }
        }, startTime);
    }

    public void scheduleCommentCreation(Long boardId, String personalId) {
        int delaySec = ThreadLocalRandom.current().nextInt(5, 10);
        Date time = Date.from(Instant.now().plusSeconds(delaySec));

        taskScheduler.schedule(() -> {
            try {
                String randomPersonalId = userService.getRandomUserWithMatchingInterest(personalId);
                if (randomPersonalId == null) {
                    log.warn("[AI 댓글 생성] 적절한 사용자 없음");
                    return;
                }
                String url = String.format("%s%s?boardId=%d&personalId=%s",
                        ec2ServerUrl, AI_COMMENT_ENDPOINT, boardId, randomPersonalId);
                String response = restTemplate.getForObject(url, String.class);
                log.info("[AI 댓글 생성] {}: {}", randomPersonalId, response);
            } catch (Exception e) {
                log.error("[AI 댓글 생성] 실패: {}", e.getMessage());
            }
        }, time);
    }

    @Transactional
    public void scheduleCommentReplyAtComment(Long commentId) {
        int delaySec = ThreadLocalRandom.current().nextInt(60, 180);
        Date time = Date.from(Instant.now().plusSeconds(delaySec));

        taskScheduler.schedule(() -> {
            try {
                Long boardId = commentService.getBoardIdByCommentId(commentId);
                BoardResponse board = boardService.getBoardById(boardId);
                String url = String.format("%s%s?originId=%d&commentId=%d&personalId=%s&isBoard=true",
                        ec2ServerUrl, AI_COMMENT_REPLY_ENDPOINT, board.getBoardId(), commentId, board.getPersonalId());
                String response = restTemplate.getForObject(url, String.class);
                log.info("[AI 댓글 답글 생성] {}: {}", board.getPersonalId(), response);
            } catch (Exception e) {
                log.error("[AI 댓글 답글 생성] 실패: {}", e.getMessage());
            }
        }, time);
    }

    @Transactional
    public void scheduleCommentReplyAtReply(Long replyId) {
        int delaySec = ThreadLocalRandom.current().nextInt(60, 180);
        Date time = Date.from(Instant.now().plusSeconds(delaySec));

        taskScheduler.schedule(() -> {
            try {
                Comment comment = replyService.getCommentByReplyId(replyId);
                String aiPersonalId = commentService.getPersonalIdById(comment.getId());
                String url = String.format("%s%s?originId=%d&commentId=%d&personalId=%s&isBoard=false",
                        ec2ServerUrl, AI_COMMENT_REPLY_ENDPOINT, comment.getId(), replyId, aiPersonalId);
                String response = restTemplate.getForObject(url, String.class);
                log.info("[AI 대댓글 생성] {}: {}", aiPersonalId, response);
            } catch (Exception e) {
                log.error("[AI 대댓글 생성] 실패: {}", e.getMessage());
            }
        }, time);
    }

    @Scheduled(fixedDelay = 3 * MINUTE)
    public void generateAiLike() {
        int delaySec = ThreadLocalRandom.current().nextInt(120, 240);
        Date startTime = Date.from(Instant.now().plusSeconds(delaySec));

        taskScheduler.schedule(() -> {
            try {
                String response = restTemplate.getForObject(ec2ServerUrl + RANDOM_AI_LIKE_ENDPOINT, String.class);
                log.info("[AI 좋아요 생성] 응답: {}", response);
            } catch (Exception e) {
                log.error("[AI 좋아요 생성] 실패: {}", e.getMessage());
            }
        }, startTime);
    }

    public void scheduleLikeCreation(Long boardId, String personalId) {
        int delaySec = ThreadLocalRandom.current().nextInt(60, 180);
        Date time = Date.from(Instant.now().plusSeconds(delaySec));

        taskScheduler.schedule(() -> {
            try {
                String randomPersonalId = userService.getRandomUserWithMatchingInterest(personalId);
                if (randomPersonalId == null) {
                    log.warn("[AI 좋아요 생성] 적절한 사용자 없음");
                    return;
                }
                String url = String.format("%s%s?boardId=%d&personalId=%s",
                        ec2ServerUrl, AI_LIKE_ENDPOINT, boardId, randomPersonalId);
                String response = restTemplate.getForObject(url, String.class);
                log.info("[AI 좋아요 생성] {}: {}", randomPersonalId, response);
            } catch (Exception e) {
                log.error("[AI 좋아요 생성] 실패: {}", e.getMessage());
            }
        }, time);
    }

    @Scheduled(fixedDelay = 5 * MINUTE)
    public void generateAiFollow() {
        try {
            String aiId = userService.getRandomUserWithMainPrompt();
            String followeeId = userService.getRandomUserWithMatchingInterestWithUnfollow(aiId);
            String url = String.format("%s%s?aiPersonalId=%s&followeePersonalId=%s",
                    ec2ServerUrl, AI_FOLLOW_ENDPOINT, aiId, followeeId);
            String response = restTemplate.getForObject(url, String.class);
            log.info("[AI 팔로우 생성] {} → {}: {}", aiId, followeeId, response);
        } catch (Exception e) {
            log.error("[AI 팔로우 생성] 실패: {}", e.getMessage());
        }
    }
}
