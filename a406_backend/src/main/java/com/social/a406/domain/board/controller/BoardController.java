package com.social.a406.domain.board.controller;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.ai.scheduler.AiScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final AiScheduler aiScheduler;

    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(
            @RequestPart("board") BoardRequest boardRequest,
            @RequestPart(value = "boardImages", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) {
        // 게시글 생성
        BoardResponse boardResponse = boardService.createBoard(boardRequest, userDetails, files);

        // 30초 후 AI 댓글 생성 스케줄링
        aiScheduler.scheduleCommentCreation(boardResponse.getBoardId(), boardResponse.getPersonalId());

        return ResponseEntity.ok(boardResponse);
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable Long boardId) {
        BoardResponse boardResponse = boardService.getBoardById(boardId);
        return ResponseEntity.ok(boardResponse);
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable Long boardId,
            @RequestPart("board") BoardRequest boardRequest,
            @RequestPart(value = "boardImages", required = false) List<MultipartFile> newFiles,
            @AuthenticationPrincipal UserDetails userDetails) {
        BoardResponse boardResponse = boardService.updateBoard(boardId, boardRequest, userDetails, newFiles);

        return ResponseEntity.ok(boardResponse);
    }

    // 유저 게시글 조회
    @GetMapping("/user")
    public ResponseEntity<List<BoardResponse>> getUserBoard(@AuthenticationPrincipal UserDetails userDetails){
        List<BoardResponse> boardResponses = boardService.getBoardByUser(userDetails.getUsername());
        return ResponseEntity.ok(boardResponses);
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long boardId){
        boardService.deleteBoard(boardId);
        return ResponseEntity.ok("Success to delete board");
    }
}
