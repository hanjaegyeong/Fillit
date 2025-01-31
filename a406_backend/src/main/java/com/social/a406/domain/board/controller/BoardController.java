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
        BoardResponse boardResponse = boardService.createBoard(boardRequest, userDetails);

        List<String> imageUrls = null;
        if(files != null && !files.isEmpty()) {
            //게시글 이미지 저장
            imageUrls = boardService.saveBoardImage(boardResponse.getBoardId(), files);
        }
        BoardResponse updatedBoardResponse = BoardResponse.from(boardResponse,imageUrls);

        // 30초 후 AI 댓글 생성 스케줄링
        aiScheduler.scheduleCommentCreation(updatedBoardResponse.getBoardId(), updatedBoardResponse.getPersonalId());

        return ResponseEntity.ok(updatedBoardResponse);
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable Long boardId) {
        BoardResponse boardResponse = boardService.getBoardById(boardId);
        List<String> imageUrls = boardService.getBoardImages(boardId);
        return ResponseEntity.ok(BoardResponse.from(boardResponse,imageUrls));
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable Long boardId,
            @RequestPart("board") BoardRequest boardRequest,
            @RequestPart(value = "boardImages", required = false) List<MultipartFile> newFiles,
            @AuthenticationPrincipal UserDetails userDetails) {
        BoardResponse boardResponse = boardService.updateBoard(boardId, boardRequest, userDetails);

        // 기존 이미지 유지 여부 확인 후 처리
        List<String> existingImageUrls = boardService.getBoardImages(boardId);  // 기존 이미지 가져오기
        List<String> newImageUrls = new ArrayList<>(existingImageUrls);          // 기존 이미지 복사

        if (newFiles != null && !newFiles.isEmpty()) {
            // 새 이미지 업로드 및 기존 이미지 삭제
            boardService.deleteBoardImage(boardId); // 기존 이미지 삭제 (선택적)
            newImageUrls = boardService.saveBoardImage(boardId, newFiles); // 새 이미지 저장
        }

        // 최종 수정된 게시글 반환
        return ResponseEntity.ok(BoardResponse.from(boardResponse, newImageUrls));
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
