package com.social.a406.domain.ai.service;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

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

    /**
     * 랜덤 방식으로 AI 게시글 생성
     */
    /**
     * 랜덤 방식으로 AI 게시글 생성
     */
    public BoardResponse generateAndSaveRandomBoard(boolean includeImage) {
        String personalId = userService.getRandomUserWithMainPrompt();
        BoardResponse response = selectRandomGenerationMethod(personalId);

        return applyKeywordProcessing(response, includeImage);
    }

    /**
     * 랜덤한 방식으로 게시글 생성 메서드 선택
     */
    private BoardResponse selectRandomGenerationMethod(String personalId) {
        return switch (new Random().nextInt(3)) {
            case 0 -> generateBoardUsingSubreddit(personalId);
            case 1 -> generateBoardUsingYoutube(personalId);
            default -> generateAndSaveBoard(personalId);
        };
    }

    /**
     * 본문 & 키워드 처리 + 이미지 추가
     */
    private BoardResponse applyKeywordProcessing(BoardResponse response, boolean includeImage) {
        parseAndSetContent(response);
        return includeImage ? enrichWithImage(response) : response;
    }

    /**
     * '!@@@'을 기준으로 본문과 키워드를 분리하고 설정
     */
    private void parseAndSetContent(BoardResponse response) {
        String[] parsedContent = parseKeywordAndUpdateContent(response.getContent());
        response.setContent(parsedContent[0]); // 본문 업데이트
        response.setKeyword(parsedContent[1]); // 추출된 키워드 설정
    }

    /**
     * 키워드 기반 이미지 추가
     */
    private BoardResponse enrichWithImage(BoardResponse response) {
        String imageUrl = flickrService.getRandomImageUrl(response.getKeyword());
        response.setImageUrls(imageUrl != null ? List.of(imageUrl) : List.of());
        return response;
    }


    /**
     * AI가 일반 게시글 생성 후 저장
     */
    public BoardResponse generateAndSaveBoard(String personalId) {
        String content = aiService.generateContent(aiService.createBoardPrompt(personalId));
        BoardRequest request = buildBoardRequest(content);
        return boardService.createAiBoard(request, personalId);
    }

    /**
     * AI가 서브레딧 기반 게시글 생성
     */
    public BoardResponse generateBoardUsingSubreddit(String personalId) {
        String content = aiService.generateContent(subredditService.createSubredditPrompt(personalId));
        BoardRequest request = buildBoardRequest(content);
        return boardService.createAiBoard(request, personalId);
    }

    /**
     * AI가 유튜브 기반 게시글 생성
     */
    public BoardResponse generateBoardUsingYoutube(String personalId) {
        String content = aiService.generateContent(youtubeService.createYoutubePrompt());
        BoardRequest request = buildBoardRequest(content);
        return boardService.createAiBoard(request, personalId);
    }

    /**
     * AI가 특정 게시글에 댓글 생성 후 저장
     */
    public CommentResponse generateAndSaveComment(Long boardId, String personalId) {
        String content = aiService.generateContent(aiService.createCommentPrompt(
                boardService.getBoardContentById(boardId),
                boardService.getBoardAuthorPersonalIdById(boardId)
        ));
        return commentService.addAiComment(boardId, new CommentRequest(content), personalId);
    }

    /**
     * 게시글 요청 DTO 생성
     */
    private BoardRequest buildBoardRequest(String content) {
        return BoardRequest.builder()
                .content(content)
                .x(ThreadLocalRandom.current().nextDouble(0, 10))
                .y(ThreadLocalRandom.current().nextDouble(0, 10))
                .z(ThreadLocalRandom.current().nextDouble(0, 10))
                .pageNumber(ThreadLocalRandom.current().nextInt(0, 5))
                .keyword(parseKeywordAndUpdateContent(content)[1])
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
}
