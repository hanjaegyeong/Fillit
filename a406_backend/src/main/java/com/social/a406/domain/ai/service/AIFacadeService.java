package com.social.a406.domain.ai.service;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.commentReply.dto.ReplyRequest;
import com.social.a406.domain.commentReply.dto.ReplyResponse;
import com.social.a406.domain.commentReply.service.ReplyService;
import com.social.a406.domain.interest.dto.InterestResponse;
import com.social.a406.domain.interest.service.InterestService;
import com.social.a406.domain.like.entity.BoardLike;
import com.social.a406.domain.like.repository.BoardLikeRepository;
import com.social.a406.domain.like.service.BoardLikeService;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIFacadeService {

    private final AIService aiService;
    private final UserService userService;
    private final BoardService boardService;
    private final CommentService commentService;
    private final SubredditService subredditService;
    private final YoutubeService youtubeService;
    private final FlickrService flickrService;
    private final InterestService interestService;
    private final BoardLikeService boardLikeService;
    private final UserRepository userRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final ReplyService replyService;

    /**
     * 랜덤 방식으로 AI 게시글 생성
     */
    public BoardResponse generateAndSaveRandomBoard(boolean includeImage) {
        String personalId = userService.getRandomUserWithMainPrompt();
        BoardResponse response = generateBoardWithRandomMethod(personalId, includeImage);
        return response;
    }

    /**
     * 랜덤한 방식으로 게시글 생성
     */
    private BoardResponse generateBoardWithRandomMethod(String personalId, boolean includeImage) {
        return switch (new Random().nextInt(3)) {
            case 0 -> generateBoardUsingSubreddit(personalId, includeImage);
            case 1 -> generateBoardUsingYoutube(personalId, includeImage);
            default -> generateAndSaveBoard(personalId, includeImage);
        };
    }

    /**
     * AI가 일반 게시글 생성 후 저장
     */
    public BoardResponse generateAndSaveBoard(String personalId, boolean includeImage) {
        String content = aiService.generateContent(aiService.createBoardPrompt(personalId));
        return createBoardWithKeywordAndImage(personalId, content, includeImage);
    }

    /**
     * AI가 서브레딧 기반 게시글 생성
     */
    public BoardResponse generateBoardUsingSubreddit(String personalId, boolean includeImage) {
        String content = aiService.generateContent(subredditService.createSubredditPrompt(personalId));
        return createBoardWithKeywordAndImage(personalId, content, includeImage);
    }

    /**
     * AI가 유튜브 기반 게시글 생성
     */
    public BoardResponse generateBoardUsingYoutube(String personalId, boolean includeImage) {
        String content = aiService.generateContent(youtubeService.createYoutubePrompt());
        return createBoardWithKeywordAndImage(personalId, content, includeImage);
    }

    /**
     * AI 게시글 생성 - boardService.createAiBoard() 호출
     */
    private BoardResponse createBoardWithKeywordAndImage(String personalId, String content, boolean includeImage) {
        // 키워드 분리 및 정리
        String[] parsedContent = parseKeywordAndUpdateContent(content);
        String updatedContent = parsedContent[0];
        String keyword = parsedContent[1];

        // 이미지 추출
        String imageUrl = null;
        if (includeImage && !keyword.isEmpty()) {
            imageUrl = flickrService.getRandomImageUrl(keyword);
        }

        // 게시글 요청 DTO 생성
        BoardRequest request = buildBoardRequest(updatedContent, keyword);

        // request에 interests 세팅
        List<String> userInterests = interestService.getUserInterests(personalId).stream()
                .map(InterestResponse::getContent)
                .collect(Collectors.toList());

        request.setInterests(userInterests);

        // 게시글 생성 및 응답 반환
        return boardService.createAiBoard(request, personalId, imageUrl);
    }

    /**
     * AI가 특정 게시글에 댓글 생성 후 저장
     */
    public CommentResponse generateAndSaveComment(Long boardId, String personalId) {
        String content = aiService.generateContent(aiService.createCommentPrompt(
                boardService.getBoardContentById(boardId),
                boardService.getBoardAuthorPersonalIdById(boardId),
                userService.getUserByPersonalId(personalId)
        ));
        return commentService.addAiComment(boardId, new CommentRequest(content), personalId);
    }

    /**
     * AI가 특정 게시글에 좋아요 생성
     */
    public void generateAndSaveLike(Long boardId, String personalId){
        String userId = userRepository.findByPersonalId(personalId).get().getId();

        Optional<BoardLike> boardLike = boardLikeRepository.findByBoard_IdAndUser_Id(boardId, userId);
        if(boardLike.isPresent()){
            System.out.println("Ai User already liked this board");
            return;
        }

        boardLikeService.addLike(personalId, boardId);
    }

    /**
     * 게시글 요청 DTO 생성
     */
    private BoardRequest buildBoardRequest(String content, String keyword) {
        return BoardRequest.builder()
                .content(content)
                .x(ThreadLocalRandom.current().nextDouble(0, 10))
                .y(ThreadLocalRandom.current().nextDouble(0, 10))
                .z(ThreadLocalRandom.current().nextDouble(0, 10))
                .pageNumber(ThreadLocalRandom.current().nextInt(0, 5))
                .keyword(keyword)
                .build();
    }

    /**
     * '!@@@'을 기준으로 본문과 키워드를 분리
     */
    private String[] parseKeywordAndUpdateContent(String content) {
        if (content == null || !content.contains("!@@@")) {
            return new String[]{content != null ? content.trim() : "", ""}; // null 방지
        }

        String[] parts = content.split("!@@@", 2);
        String updatedContent = parts[0].trim(); // 본문
        String keyword = parts[1].trim(); // 키워드

        return new String[]{updatedContent, keyword};
    }

    public ReplyResponse generateAndSaveCommentReply(Long originId, Long commentId, String personalId, boolean isBoard) {
        String content = null;
        String origin = null;
        if(isBoard){
            content = commentService.getComment(commentId).getContent();
            origin = boardService.getBoardContentById(originId);
        }else{
            content = replyService.getReply(commentId);
            origin = commentService.getComment(originId).getContent();
        }
        String prompt = aiService.createCommentReplyPrompt(origin, content, personalId);
        String generateContent = aiService.generateContent(prompt);
        ReplyRequest replyRequest = ReplyRequest.builder()
                .content(generateContent)
                .build();
        return replyService.saveReply(commentId, replyRequest, personalId);
    }
}
