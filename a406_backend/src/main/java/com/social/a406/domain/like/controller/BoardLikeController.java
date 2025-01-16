package com.social.a406.domain.like.controller;

import com.social.a406.domain.like.dto.LikedUserResponse;
import com.social.a406.domain.like.service.BoardLikeService;
import lombok.RequiredArgsConstructor;
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
    public void likeBoard(@PathVariable Long boardId, @AuthenticationPrincipal UserDetails userDetails) {
        boardLikeService.addLike(userDetails.getUsername(), boardId);
    }

    @DeleteMapping
    public void unlikeBoard(@PathVariable Long boardId, @AuthenticationPrincipal UserDetails userDetails) {
        boardLikeService.removeLike(userDetails.getUsername(), boardId);
    }
}
