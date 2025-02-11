package com.social.a406.domain.like.controller;

import com.social.a406.domain.like.dto.LikedUserResponse;
import com.social.a406.domain.like.service.ReplyLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/replys/{replyId}/likes")
@RequiredArgsConstructor
public class ReplyLikeController {

    private final ReplyLikeService replyLikeService;

    @PostMapping
    public ResponseEntity<String> likeReply(@PathVariable Long replyId, @AuthenticationPrincipal UserDetails userDetails) {
        replyLikeService.addLike(userDetails.getUsername(), replyId);
        return ResponseEntity.status(201).body("success to like reply");
    }

    @DeleteMapping
    public ResponseEntity<Void> unlikeReply(@PathVariable Long replyId, @AuthenticationPrincipal UserDetails userDetails) {
        replyLikeService.removeLike(userDetails.getUsername(), replyId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<LikedUserResponse>> getUsersWhoLikedReply(@PathVariable Long replyId) {
        return ResponseEntity.ok(
                replyLikeService.getUsersWhoLikedReply(replyId));
    }
}
