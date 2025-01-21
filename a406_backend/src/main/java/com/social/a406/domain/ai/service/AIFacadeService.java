package com.social.a406.domain.ai.service;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// 각 서비스 조율해주는 Facade 서비스
@Service
@RequiredArgsConstructor
public class AIFacadeService {

    private final AIService aiService;
    private final BoardService boardService;
    private final CommentService commentService;

    private static final String COMMENT_PROMPT = "Please write a reply to this post.";

    public BoardResponse generateAndSaveBoard(String nickname, String apiKey, String prompt) {
        String generatedContent = aiService.generateContent(nickname, apiKey, prompt);
        return saveGeneratedBoard(generatedContent, nickname);
    }

    public CommentResponse generateAndSaveComment(Long boardId, String nickname, String apiKey) {
        String finalPrompt = buildCommentPrompt(boardId);
        String generatedContent = aiService.generateContent(nickname, apiKey, finalPrompt);
        return saveGeneratedComment(boardId, generatedContent, nickname);
    }

    private BoardResponse saveGeneratedBoard(String content, String nickname) {
        BoardRequest boardRequest = BoardRequest.builder()
                .content(content)
                .build();
        return boardService.createAiBoard(boardRequest, nickname);
    }

    private CommentResponse saveGeneratedComment(Long boardId, String content, String nickname) {
        CommentRequest commentRequest = CommentRequest.builder()
                .content(content)
                .build();
        return commentService.addAiComment(boardId, commentRequest, nickname);
    }

    private String buildCommentPrompt(Long boardId) {
        String boardContent = boardService.getBoardContentById(boardId);
        String boardAuthorNickname = boardService.getBoardAuthorNicknameById(boardId);
        return String.format("User nickname: %s, Content: %s\n%s", boardAuthorNickname, boardContent, COMMENT_PROMPT);
    }
}
