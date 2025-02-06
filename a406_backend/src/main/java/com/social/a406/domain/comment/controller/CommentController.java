package com.social.a406.domain.comment.controller;

import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.service.CommentService;
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

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long boardId,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(201).body(
                commentService.addComment(boardId, commentRequest, userDetails));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsByBoard(@PathVariable Long boardId) {
        return ResponseEntity.ok(
                commentService.getCommentsByBoard(boardId));
    }

    @GetMapping("/get/{commentId}")
    public ResponseEntity<CommentResponse> getComment(@PathVariable Long commentId){
        return ResponseEntity.ok(
                commentService.getComment(commentId));
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
        commentService.deleteComment(commentId, userDetails);
        return ResponseEntity.ok("Success to delete comment");
    }
}
