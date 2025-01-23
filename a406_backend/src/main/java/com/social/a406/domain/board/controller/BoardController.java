package com.social.a406.domain.board.controller;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.scheduler.service.AiScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final AiScheduler aiScheduler;

    @PostMapping
    public BoardResponse createBoard(
            @RequestBody BoardRequest boardRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        // 게시글 생성
        BoardResponse boardResponse = boardService.createBoard(boardRequest, userDetails);

        // 30초 후 AI 댓글 생성 스케줄링
        aiScheduler.scheduleCommentCreation(boardResponse.getBoardId(), boardResponse.getPersonalId());

        return boardResponse;
    }

    @GetMapping("/{boardId}")
    public BoardResponse getBoard(@PathVariable Long boardId) {
        return boardService.getBoardById(boardId);
    }

    @PutMapping("/{boardId}")
    public BoardResponse updateBoard(
            @PathVariable Long boardId,
            @RequestBody BoardRequest boardRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        return boardService.updateBoard(boardId, boardRequest, userDetails);
    }
}
