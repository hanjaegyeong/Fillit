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
    public BoardResponse generateAndSaveBoard(String nickname, String prompt) {
        String generatedContent = aiService.generateContent(nickname, prompt);
        return saveGeneratedBoard(generatedContent, nickname);
    }

    // 댓글 생성&저장
    public CommentResponse generateAndSaveComment(Long boardId, String nickname) {
        String finalPrompt = buildCommentPrompt(boardId);
        String generatedContent = aiService.generateContent(nickname, finalPrompt);
        return saveGeneratedComment(boardId, generatedContent, nickname);
    }

    // 게시글 저장
    private BoardResponse saveGeneratedBoard(String content, String nickname) {
        BoardRequest boardRequest = createBoardRequest(content);
        return boardService.createAiBoard(boardRequest, nickname);
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
    public BoardResponse generateBoardUsingSubredditHotPost(String nickname) {
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
        return generateAndSaveBoard(nickname, prompt);
    }

    public BoardResponse generateBoardUsingYoutube(String nickname) {
        // youtube 인기 동영상 데이터 가져오기
        Youtube youtube = youtubeService.getRandomPopularVideos();
        String prompt = youtubeService.generatePrompt(youtube);

        return generateAndSaveBoard(nickname, prompt);
    }
}
