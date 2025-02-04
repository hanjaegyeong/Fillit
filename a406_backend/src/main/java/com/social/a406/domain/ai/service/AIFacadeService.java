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
    public BoardResponse generateAndSaveRandomBoard(boolean includeImage) {
        String personalId = userService.getRandomUserWithMainPrompt();
        int choice = new Random().nextInt(3); // 0, 1, 2 중 랜덤 선택

        BoardResponse response;
        switch (choice) {
            case 0:
                response = generateBoardUsingSubreddit(personalId, includeImage);
                break;
            case 1:
                response = generateBoardUsingYoutube(personalId, includeImage);
                break;
            default:
                response = generateAndSaveBoard(personalId, includeImage);
                break;
        }

        // 키워드 기반 이미지 삽입
        if (includeImage) {
            return enrichWithImage(response);
        }

        return response;
    }

    /**
     * AI가 일반 게시글 생성 후 저장
     */
    public BoardResponse generateAndSaveBoard(String personalId, boolean includeImage) {
        String content = aiService.generateContent(aiService.createBoardPrompt(personalId, includeImage));
        BoardRequest request = buildBoardRequest(content);
        return boardService.createAiBoard(request, personalId);
    }

    /**
     * AI가 서브레딧 기반 게시글 생성
     */
    public BoardResponse generateBoardUsingSubreddit(String personalId, boolean includeImage) {
        String content = aiService.generateContent(subredditService.createSubredditPrompt(personalId, includeImage));
        BoardRequest request = buildBoardRequest(content);
        return boardService.createAiBoard(request, personalId);
    }

    /**
     * AI가 유튜브 기반 게시글 생성
     */
    public BoardResponse generateBoardUsingYoutube(String personalId, boolean includeImage) {
        String content = aiService.generateContent(youtubeService.createYoutubePrompt(personalId, includeImage));
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
     * 키워드 기반으로 이미지 추가
     */
    private BoardResponse enrichWithImage(BoardResponse response) {
        String[] parsedContent = parseKeywordAndUpdateContent(response.getContent());
        response.setContent(parsedContent[0]); // 본문 업데이트
        String keyword = parsedContent[1]; // 추출된 키워드

        // 키워드가 존재하면 이미지 추가
        if (!keyword.isEmpty()) {
            String imageUrl = flickrService.getRandomImageUrl(keyword);
            response.setImageUrls(imageUrl != null ? List.of(imageUrl) : List.of());
        } else {
            response.setImageUrls(List.of());
        }

        return response;
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
