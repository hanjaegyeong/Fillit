package com.social.a406.domain.like.controller;

import com.social.a406.domain.like.dto.LikedUserResponse;
import com.social.a406.domain.like.service.CommentLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments/{commentId}/likes")
@RequiredArgsConstructor
public class CommentLikeController {

    private final CommentLikeService commentLikeService;

    @PostMapping
    public ResponseEntity<String> likeComment(@PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails) {
        commentLikeService.addLike(userDetails.getUsername(), commentId);
        return ResponseEntity.status(201).body("success to like comment");
    }

    @DeleteMapping
    public ResponseEntity<Void> unlikeComment(@PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails) {
        commentLikeService.removeLike(userDetails.getUsername(), commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<LikedUserResponse>> getUsersWhoLikedComment(@PathVariable Long commentId) {
        return ResponseEntity.ok(
                commentLikeService.getUsersWhoLikedComment(commentId));
    }
}
