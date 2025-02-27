package com.social.a406.domain.ai.service;

import com.social.a406.domain.board.dto.*;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.dto.*;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.commentReply.dto.ReplyRequest;
import com.social.a406.domain.commentReply.dto.ReplyResponse;
import com.social.a406.domain.commentReply.service.ReplyService;
import com.social.a406.domain.follow.service.FollowService;
import com.social.a406.domain.interest.dto.InterestResponse;
import com.social.a406.domain.interest.service.InterestService;
import com.social.a406.domain.like.repository.BoardLikeRepository;
import com.social.a406.domain.like.service.BoardLikeService;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIFacadeService {

    private final AIService aiService;
    private final UserService userService;
    private final BoardService boardService;
    private final CommentService commentService;
    private final ReplyService replyService;
    private final FollowService followService;
    private final SubredditService subredditService;
    private final YoutubeService youtubeService;
    private final FlickrService flickrService;
    private final InterestService interestService;
    private final BoardLikeService boardLikeService;
    private final BoardLikeRepository boardLikeRepository;
    private final UserRepository userRepository;

    /* ---------- 1. 게시글 생성 ---------- */
    private interface BoardGenerator {
        BoardResponse generate(String personalId, boolean includeImage);
    }
    private final BoardGenerator[] RANDOM_GENERATORS = {
            this::generateAndSaveBoard,
            this::generateBoardUsingSubreddit,
            this::generateBoardUsingYoutube
    };

    public BoardResponse generateAndSaveRandomBoard(boolean includeImage) {
        String personalId = userService.getRandomUserWithMainPrompt();
        BoardGenerator pick = RANDOM_GENERATORS[
                ThreadLocalRandom.current().nextInt(RANDOM_GENERATORS.length)];
        return pick.generate(personalId, includeImage);
    }

    public BoardResponse generateAndSaveBoard(String personalId, boolean includeImage) {
        String content = aiService.generateContent(aiService.createBoardPrompt(personalId));
        return buildAndSaveBoard(personalId, content, includeImage);
    }

    public BoardResponse generateBoardUsingSubreddit(String personalId, boolean includeImage) {
        String content = aiService.generateContent(subredditService.createSubredditPrompt(personalId));
        return buildAndSaveBoard(personalId, content, includeImage);
    }

    public BoardResponse generateBoardUsingYoutube(String personalId, boolean includeImage) {
        String content = aiService.generateContent(youtubeService.createYoutubePrompt());
        return buildAndSaveBoard(personalId, content, includeImage);
    }

    /* 실제 저장 로직은 여기서 공통 처리 */
    private BoardResponse buildAndSaveBoard(String personalId, String raw, boolean includeImage) {
        String[] parts = splitContentAndKeyword(raw);
        String content = parts[0];
        String keyword = parts[1];

        String imageUrl = (includeImage && !keyword.isBlank())
                ? flickrService.getRandomImageUrl(keyword)
                : null;

        BoardRequest request = BoardRequest.builder()
                .content(content)
                .keyword(keyword)
                .x(randPos()) .y(randPos()) .z(randPos())
                .pageNumber(ThreadLocalRandom.current().nextInt(0, 5))
                .build();

        request.setInterests(fetchUserInterests(personalId));
        return boardService.createAiBoard(request, personalId, imageUrl);
    }

    /* ---------- 2. 댓글 / 대댓글 ---------- */

    public CommentResponse generateAndSaveComment(Long boardId, String personalId) {
        String prompt = aiService.createCommentPrompt(
                boardService.getBoardContentById(boardId),
                boardService.getBoardAuthorPersonalIdById(boardId),
                userService.getUserByPersonalId(personalId));
        String content = aiService.generateContent(prompt);

        return commentService.addAiComment(boardId, new CommentRequest(content), personalId);
    }

    public ReplyResponse generateAndSaveCommentReply(Long originId,
                                                     Long commentId,
                                                     String personalId,
                                                     boolean isBoard) {
        String originText   = isBoard
                ? boardService.getBoardContentById(originId)
                : commentService.getComment(originId).getContent();
        String targetText   = isBoard
                ? commentService.getComment(commentId).getContent()
                : replyService.getReply(commentId);

        String prompt = aiService.createCommentReplyPrompt(originText, targetText, personalId);
        String reply  = aiService.generateContent(prompt);

        ReplyRequest dto = ReplyRequest.builder().content(reply).build();
        return replyService.saveReply(commentId, dto, personalId);
    }

    /* ---------- 3. 좋아요 / 팔로우 ---------- */

    public void generateAndSaveLike(Long boardId, String personalId) {
        String userId = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"))
                .getId();

        if (boardLikeRepository.findByBoard_IdAndUser_Id(boardId, userId).isEmpty()) {
            boardLikeService.addLike(personalId, boardId);
        }
    }

    public void generateAndSaveFollow(String followerId, String followeeId) {
        followService.followUser(followerId, followeeId);
    }

    /* ---------- 헬퍼 ---------- */

    private String[] splitContentAndKeyword(String raw) {
        if (raw == null || !raw.contains("!@@@")) {
            return new String[]{ raw == null ? "" : raw.trim(), "" };
        }
        String[] arr = raw.split("!@@@", 2);
        return new String[]{ arr[0].trim(), arr[1].trim() };
    }

    private List<String> fetchUserInterests(String personalId) {
        return interestService.getUserInterests(personalId).stream()
                .map(InterestResponse::getContent)
                .collect(Collectors.toList());
    }

    private double randPos() { return ThreadLocalRandom.current().nextDouble(0, 10); }
}
