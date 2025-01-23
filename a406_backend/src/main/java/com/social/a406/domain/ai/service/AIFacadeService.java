package com.social.a406.domain.ai.service;

import com.social.a406.domain.ai.entity.Subreddit;
import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.ai.entity.Youtube;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Random;

// 각 서비스 조율해주는 Facade 서비스
@Service
@RequiredArgsConstructor
public class AIFacadeService {

    private final AIService aiService;
    private final BoardService boardService;
    private final CommentService commentService;
    private final SubredditService subredditService;
    private final YoutubeService youtubeService;

    private static final String COMMENT_PROMPT = "Please write a reply to this post.";

    // 게시글 생성&저장
    public BoardResponse generateAndSaveBoard(String personalId, String prompt) {
        String generatedContent = aiService.generateContent(personalId, prompt);
        return saveGeneratedBoard(generatedContent, personalId);
    }

    // 댓글 생성&저장
    public CommentResponse generateAndSaveComment(Long boardId, String personalId) {
        String finalPrompt = buildCommentPrompt(boardId);
        String generatedContent = aiService.generateContent(personalId, finalPrompt);
        return saveGeneratedComment(boardId, generatedContent, personalId);
    }

    // 게시글 저장
    private BoardResponse saveGeneratedBoard(String content, String personalId) {
        BoardRequest boardRequest = createBoardRequest(content);
        return boardService.createAiBoard(boardRequest, personalId);
    }

    private BoardRequest createBoardRequest(String content) {
        return BoardRequest.builder()
                .content(content)
                .x(generateRandomDouble(0, 10)) // 좌표 0 ~ 10 사이 랜덤값
                .y(generateRandomDouble(0, 10))
                .pageNumber(generateRandomInt(0, 5)) // 페이지넘버 0 ~ 5 사이 랜덤값
                .keyword(generateKeyword(content)) // 키워드는 게시글 맨 앞 5글자까지
                .build();
    }

    private double generateRandomDouble(double min, double max) {
        return Math.random() * (max - min) + min;
    }

    private int generateRandomInt(int min, int max) {
        return (int) (Math.random() * (max - min + 1)) + min;
    }

    private String generateKeyword(String content) {
        return content.length() >= 5 ? content.substring(0, 5) : content;
    }

    // 댓글 저장
    private CommentResponse saveGeneratedComment(Long boardId, String content, String personalId) {
        CommentRequest commentRequest = CommentRequest.builder()
                .content(content)
                .build();
        return commentService.addAiComment(boardId, commentRequest, personalId);
    }

    // 댓글 프롬프트 생성
    private String buildCommentPrompt(Long boardId) {
        String boardContent = boardService.getBoardContentById(boardId);
        String boardAuthorpersonalId = boardService.getBoardAuthorpersonalIdById(boardId);
        return String.format("User personalId: %s, Content: %s\n%s", boardAuthorpersonalId, boardContent, COMMENT_PROMPT);
    }

    // 서브레딧 핫게시글 기반 게시글 생성
    public BoardResponse generateBoardUsingSubredditHotPost(String personalId) {
        Subreddit randomSubreddit = subredditService.getRandomUserSubreddit(personalId); // 해당 유저의 랜덤 서브레딧
        String subredditName = randomSubreddit.getName();

        String hotPostData = subredditService.getRandomHotPost(subredditName); // 해당 서브레딧의 랜덤 핫게시글

        String prompt = subredditService.generatePrompt(subredditName, hotPostData); // 프롬프트 생성

        return generateAndSaveBoard(personalId, prompt);
    }

    // 유튜브 인기 동영상 기반 게시글 생성
    public BoardResponse generateBoardUsingYoutube(String personalId) {
        Youtube youtube = youtubeService.getRandomPopularVideos();
        String prompt = youtubeService.generatePrompt(youtube);

        return generateAndSaveBoard(personalId, prompt);
    }
}
