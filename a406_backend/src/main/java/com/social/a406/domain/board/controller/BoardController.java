package com.social.a406.domain.board.controller;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    public BoardResponse createBoard(
            @RequestBody BoardRequest boardRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        return boardService.createBoard(boardRequest, userDetails);
    }

    @GetMapping("/{boardId}")
    public BoardResponse getBoard(@PathVariable Long boardId) {
        return boardService.getBoardById(boardId);
    }
}
