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
    private final ReplyService replyService;

    /**
     * AI가 일반 게시글 생성 후 저장
     */
    public BoardResponse generateAndSaveBoard(String personalId) {
        String prompt = aiService.createBoardPrompt(personalId);
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
    public BoardResponse generateBoardUsingSubreddit(String personalId) {
        String prompt = subredditService.createSubredditPrompt(personalId);
        String generatedContent = aiService.generateContent(prompt);
        BoardRequest boardRequest = buildBoardRequest(generatedContent);
        return boardService.createAiBoard(boardRequest, personalId);
    }

    /**
     * AI가 유튜브 기반 게시글 생성
     */
    public BoardResponse generateBoardUsingYoutube(String personalId) {
        String prompt = youtubeService.createYoutubePrompt(personalId);
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
