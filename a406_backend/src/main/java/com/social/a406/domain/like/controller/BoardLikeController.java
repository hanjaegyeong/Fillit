package com.social.a406.domain.like.controller;

import com.social.a406.domain.like.dto.LikedUserResponse;
import com.social.a406.domain.like.service.BoardLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards/{boardId}/likes")
@RequiredArgsConstructor
public class BoardLikeController {

    private final BoardLikeService boardLikeService;

    @PostMapping
    public ResponseEntity<String> likeBoard(@PathVariable Long boardId, @AuthenticationPrincipal UserDetails userDetails) {
        boardLikeService.addLike(userDetails.getUsername(), boardId);
        return ResponseEntity.status(201).body("Success to like Board");
    }

    @DeleteMapping
    public ResponseEntity<Void> unlikeBoard(@PathVariable Long boardId, @AuthenticationPrincipal UserDetails userDetails) {
        boardLikeService.removeLike(userDetails.getUsername(), boardId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<LikedUserResponse>> getUsersWhoLikedBoard(@PathVariable Long boardId) {
        return ResponseEntity.ok(
                boardLikeService.getUsersWhoLikedBoard(boardId));
    }
}
