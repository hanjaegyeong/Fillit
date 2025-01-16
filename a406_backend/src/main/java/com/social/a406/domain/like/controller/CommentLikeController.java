package com.social.a406.domain.like.controller;

import com.social.a406.domain.like.dto.LikedUserResponse;
import com.social.a406.domain.like.service.CommentLikeService;
import lombok.RequiredArgsConstructor;
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
    public void likeComment(@PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails) {
        commentLikeService.addLike(userDetails.getUsername(), commentId);
    }

    @DeleteMapping
    public void unlikeComment(@PathVariable Long commentId, @AuthenticationPrincipal UserDetails userDetails) {
        commentLikeService.removeLike(userDetails.getUsername(), commentId);
    }

    @GetMapping
    public List<LikedUserResponse> getUsersWhoLikedComment(@PathVariable Long commentId) {
        return commentLikeService.getUsersWhoLikedComment(commentId);
    }
}
