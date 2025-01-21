package com.social.a406.domain.ai.service;

import com.social.a406.domain.ai.entity.Subreddit;
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
    private final SubredditService subredditService;

    private static final String COMMENT_PROMPT = "Please write a reply to this post.";

    // 게시글 생성&저장
    public BoardResponse generateAndSaveBoard(String nickname, String apiKey, String prompt) {
        String generatedContent = aiService.generateContent(nickname, apiKey, prompt);
        return saveGeneratedBoard(generatedContent, nickname);
    }

    // 댓글 생성&저장
    public CommentResponse generateAndSaveComment(Long boardId, String nickname, String apiKey) {
        String finalPrompt = buildCommentPrompt(boardId);
        String generatedContent = aiService.generateContent(nickname, apiKey, finalPrompt);
        return saveGeneratedComment(boardId, generatedContent, nickname);
    }

    // 게시글 저장
    private BoardResponse saveGeneratedBoard(String content, String nickname) {
        BoardRequest boardRequest = BoardRequest.builder()
                .content(content)
                .build();
        return boardService.createAiBoard(boardRequest, nickname);
    }

    // 댓글 저장
    private CommentResponse saveGeneratedComment(Long boardId, String content, String nickname) {
        CommentRequest commentRequest = CommentRequest.builder()
                .content(content)
                .build();
        return commentService.addAiComment(boardId, commentRequest, nickname);
    }

    // 댓글 프롬프트 생성
    private String buildCommentPrompt(Long boardId) {
        String boardContent = boardService.getBoardContentById(boardId);
        String boardAuthorNickname = boardService.getBoardAuthorNicknameById(boardId);
        return String.format("User nickname: %s, Content: %s\n%s", boardAuthorNickname, boardContent, COMMENT_PROMPT);
    }

    // 서브레딧 핫게시글 기반 게시글 생성
    public BoardResponse generateBoardUsingSubredditHotPost(String nickname, String apiKey) {
        // 특정 유저의 랜덤 서브레딧 가져오기
        Subreddit randomSubreddit = subredditService.getRandomUserSubreddit(nickname);
        String subredditName = randomSubreddit.getName();

        // 핫 게시글 데이터 가져오기
        String hotPostData = subredditService.getRandomHotPost(subredditName);

        // 프롬프트 생성
        String prompt = String.format(
                "Let's dive into the subreddit '%s'. Here's a hot post:\n\n%s\n\nWrite an engaging article inspired by this topic.",
                subredditName, hotPostData
        );

        // 게시글 생성 및 저장
        return generateAndSaveBoard(nickname, apiKey, prompt);
    }
}
