package com.social.a406.domain.comment.controller;

import com.social.a406.domain.ai.scheduler.AiScheduler;
import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.commentReply.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board/{boardId}/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final AiScheduler aiScheduler;
    private final ReplyService replyService;

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long boardId,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        CommentResponse response = commentService.addComment(boardId, commentRequest, userDetails);

        // ai 대댓글 자동 생성
        if(commentService.isAIAndRandomCreate(boardId)) {
            aiScheduler.scheduleCommentReplyAtComment(response.getCommentId());
        }

        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsByBoard(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long boardId) {
        return ResponseEntity.ok(
                commentService.getCommentsByBoard(userDetails.getUsername(), boardId));
    }

    @GetMapping("/get/{commentId}")
    public ResponseEntity<CommentResponse> getComment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long commentId){
        return ResponseEntity.ok(
                commentService.getCommentWithLiked(userDetails.getUsername(), commentId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                commentService.updateComment(commentId, commentRequest, userDetails));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        replyService.deleteAllReplyByComment(commentId, userDetails); // 하위 대댓글들 먼저 삭제
        commentService.deleteComment(commentId, userDetails);
        return ResponseEntity.ok("Success to delete comment");
    }
}
