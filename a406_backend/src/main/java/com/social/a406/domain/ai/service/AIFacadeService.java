package com.social.a406.domain.ai.service;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AIFacadeService {

    private final AIService aiService;
    private final BoardService boardService;
    private final CommentService commentService;
    private final SubredditService subredditService;
    private final YoutubeService youtubeService;

    /**
     * AI가 일반 게시글 생성 후 저장
     */
    public BoardResponse generateAndSaveBoard(String personalId, boolean includeImage) {
        String prompt = aiService.createBoardPrompt(personalId, includeImage);
        String generatedContent = aiService.generateContent(prompt);
        BoardRequest boardRequest = buildBoardRequest(generatedContent);
        return boardService.createAiBoard(boardRequest, personalId);
    }

    /**
     * AI가 특정 게시글에 댓글 생성 후 저장
     */
    public CommentResponse generateAndSaveComment(Long boardId, String personalId) {
        String boardContent = boardService.getBoardContentById(boardId);
        String authorPersonalId = boardService.getBoardAuthorPersonalIdById(boardId);

        String prompt = aiService.createCommentPrompt(boardContent, authorPersonalId);
        String generatedContent = aiService.generateContent(prompt);

        return commentService.addAiComment(boardId, new CommentRequest(generatedContent), personalId);
    }

    /**
     * AI가 서브레딧 기반 게시글 생성
     */
    public BoardResponse generateBoardUsingSubreddit(String personalId, boolean includeImage) {
        String prompt = subredditService.createSubredditPrompt(personalId, includeImage);
        String generatedContent = aiService.generateContent(prompt);
        BoardRequest boardRequest = buildBoardRequest(generatedContent);
        return boardService.createAiBoard(boardRequest, personalId);
    }

    /**
     * AI가 유튜브 기반 게시글 생성
     */
    public BoardResponse generateBoardUsingYoutube(String personalId, boolean includeImage) {
        String prompt = youtubeService.createYoutubePrompt(personalId, includeImage);
        String generatedContent = aiService.generateContent(prompt);
        BoardRequest boardRequest = buildBoardRequest(generatedContent);
        return boardService.createAiBoard(boardRequest, personalId);
    }

    /**
     * 게시글 요청 DTO 생성 (빌더 패턴 적용)
     */
    private BoardRequest buildBoardRequest(String content) {
        return BoardRequest.builder()
                .content(content)
                .x(ThreadLocalRandom.current().nextDouble(0, 10))
                .y(ThreadLocalRandom.current().nextDouble(0, 10))
                .z(ThreadLocalRandom.current().nextDouble(0, 10))
                .pageNumber(ThreadLocalRandom.current().nextInt(0, 5))
                .keyword(content.length() >= 5 ? content.substring(0, 5) : content)
                .build();
    }

    public String[] parseKeywordAndUpdateContent(String content) {
        if (content == null || !content.contains("!@@@")) {
            return new String[]{content, ""}; // 원본 content 유지, 키워드는 빈 문자열
        }

        // "!@@@" 이후의 문자열 가져오기
        String[] parts = content.split("!@@@", 2);
        if (parts.length < 2) {
            return new String[]{content, ""};
        }

        // 개행 문자 제거 및 앞뒤 공백 제거
        String keyword = parts[1].trim().replaceAll("\\n", "");
        String updatedContent = parts[0].trim(); // 키워드 이전 부분만 content로 유지

        return new String[]{updatedContent, keyword};
    }
}
