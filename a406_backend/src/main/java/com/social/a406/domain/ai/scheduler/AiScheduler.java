package com.social.a406.domain.ai.scheduler;

import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.commentReply.service.ReplyService;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AiScheduler {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Random random = new Random();
    private final ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
    private final UserService userService;
    private final CommentService commentService;
    private final ReplyService replyService;
    private final BoardService boardService;

    private final String AI_COMMENT_ENDPOINT = "/api/ai/generate/comment";
    private final String RANDOM_AI_COMMENT_ENDPOINT = "/api/ai/generate/random/comment";
    private final String AI_BOARD_ENDPOINT = "/api/ai/generate/random/board";
    private final String AI_COMMENT_REPLY_ENDPOINT = "/api/ai/generate/reply";
    private final int MINUTE = 60000;

    @Value("${EC2_SERVER_URL}")
    private String ec2ServerUrl;

    // AI 게시글 생성 컨트롤러 자동 호출
    @Scheduled(fixedDelay = 10 * MINUTE) // 10분마다 실행
    public void callGenerateAiBoardController() {
        // 랜덤한 지연 시간 생성
        int delay = random.nextInt(MINUTE) + 20 * MINUTE; // 1~20분 딜레이

        try {
            System.out.println("Waiting for " + delay + " seconds before board triggering...");
            Thread.sleep(delay * 10L);

            // 30% 확률로 이미지 게시글 생성
            String requestUrl = ec2ServerUrl + AI_BOARD_ENDPOINT;
            if (ThreadLocalRandom.current().nextInt(100) < 30) {
                requestUrl += "?includeImage=true";
            }

            // EC2 컨트롤러 호출
            String response = restTemplate.getForObject(requestUrl, String.class);
            System.out.println("Response from EC2: " + response);
        } catch (Exception e) {
            System.err.println("Failed to call EC2 controller: " + e.getMessage());
        }
    }

    // 랜덤 게시글에 랜덤 AI 댓글 생성 컨트롤러 자동 호출
    // 본인이 댓글 단 게시글 / 본인 게시글 제외
    @Scheduled(fixedDelay = 10 * MINUTE) // 10분마다 실행
    public void callGenerateAiCommentController() {
        // 랜덤한 지연 시간 생성
        int delay = random.nextInt(MINUTE) + 20 * MINUTE; // 1~20분 딜레이

        try {
            System.out.println("Waiting for " + delay + " seconds before comment triggering...");
            Thread.sleep(delay * 10L);

            // EC2 컨트롤러 호출
            String response = restTemplate.getForObject(ec2ServerUrl + RANDOM_AI_COMMENT_ENDPOINT, String.class);
            System.out.println("Response from EC2: " + response);
        } catch (Exception e) {
            System.err.println("Failed to call EC2 controller: " + e.getMessage());
        }
    }

    // 사용자(personalId)가 게시글 업로드 후 AI댓글 자동 생성
    public void scheduleCommentCreation(Long boardId, String personalId) {
        taskScheduler.initialize();

        int delayInSeconds = ThreadLocalRandom.current().nextInt(5 * MINUTE, 30 * MINUTE); // 5분 ~ 30분 사이 딜레이
        System.out.println("Task scheduled to execute after " + delayInSeconds + " seconds");

        taskScheduler.schedule(() -> {
            try {
                // 주어진 personalId와 동일한 관심사를 가진 랜덤 AI 사용자 찾기
                String randomPersonalId = userService.getRandomUserWithMatchingInterest(personalId);

                if (randomPersonalId == null) {
                    System.err.println("No suitable user found for AI comment creation.");
                    return;
                }

                String response = restTemplate.getForObject(
                        ec2ServerUrl + AI_COMMENT_ENDPOINT + "?boardId=" + boardId + "&personalId=" + randomPersonalId,
                        String.class
                );

                System.out.println("AI Comment Created by " + randomPersonalId + ": " + response);
            } catch (Exception e) {
                System.err.println("Failed to create AI comment: " + e.getMessage());
            } finally {
                taskScheduler.shutdown(); // 작업 완료 후 스케줄러 종료. 없으면 반복.
            }
        }, triggerContext -> Instant.now().plusSeconds(delayInSeconds));
    }

    // AI 게시글에 댓글이 생긴 경우 답장 생성
    @Transactional
    public void scheduleCommentReplyCreationAtComment(Long commentId){
        taskScheduler.initialize();
        int delayInSeconds = ThreadLocalRandom.current().nextInt(10, 61);
        System.out.println("Task scheduled to execute after " + delayInSeconds + " seconds");

        taskScheduler.schedule(() -> {
            try {
                Long boardId = commentService.getBoardIdByCommentId(commentId);
                BoardResponse board = boardService.getBoardById(boardId);
                String aiPersonalId = board.getPersonalId();

                String response = restTemplate.getForObject(
                        ec2ServerUrl + AI_COMMENT_REPLY_ENDPOINT + "?originId=" + board.getBoardId() + "&commentId=" + commentId + "&personalId=" + aiPersonalId +"&isBoard=true",
                        String.class
                );
                System.out.println("AI Comment reply Created by " + aiPersonalId + ": " + response);
            } catch (Exception e) {
                System.err.println("Failed to create AI comment reply: " + e.getMessage());
            }finally {
                taskScheduler.shutdown(); // 작업 완료 후 스케줄러 종료. 없으면 반복.
            }
        }, triggerContext -> Instant.now().plusSeconds(delayInSeconds));
    }

    // AI 댓글에 대댓글이 생긴 경우 답장 생성
    @Transactional
    public void scheduleCommentReplyCreationAtCommentReply(Long replyId){
        taskScheduler.initialize();
        int delayInSeconds = ThreadLocalRandom.current().nextInt(10, 61);
        System.out.println("Task scheduled to execute after " + delayInSeconds + " seconds");

        taskScheduler.schedule(() -> {
            try {
                Comment comment = replyService.getCommentByReplyId(replyId);
                String aiPersonalId = commentService.getPersonalIdById(comment.getId());

                String response = restTemplate.getForObject(
                        ec2ServerUrl + AI_COMMENT_REPLY_ENDPOINT + "?originId=" + comment.getId() + "&commentId=" + replyId + "&personalId=" + aiPersonalId +"&isBoard=false",
                        String.class
                );
                System.out.println("AI Comment reply Created by " + aiPersonalId + ": " + response);
            } catch (Exception e) {
                System.err.println("Failed to create AI comment reply: " + e.getMessage());
            }finally {
                taskScheduler.shutdown(); // 작업 완료 후 스케줄러 종료. 없으면 반복.
            }
        }, triggerContext -> Instant.now().plusSeconds(delayInSeconds));
    }

}