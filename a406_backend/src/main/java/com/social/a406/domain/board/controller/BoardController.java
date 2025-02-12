package com.social.a406.domain.board.controller;

import com.social.a406.domain.board.dto.*;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.ai.scheduler.AiScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

        // 30초 후 AI 댓글 생성, 좋아요 스케줄링
        aiScheduler.scheduleCommentCreation(boardResponse.getBoardId(), boardResponse.getPersonalId());
        aiScheduler.scheduleLikeCreation(boardResponse.getBoardId(), boardResponse.getPersonalId());

        return ResponseEntity.status(201).body(boardResponse);
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable Long boardId,
                                                  @AuthenticationPrincipal UserDetails userDetails) {
        BoardResponse boardResponse = boardService.getBoardByIdAndUser(boardId, userDetails.getUsername());
        return ResponseEntity.ok(boardResponse);
    }

    // 검색 창 추천 게시글 조회
    @GetMapping("/recommend")
    public ResponseEntity<List<BoardRecommendResonse>> recommendBoard(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long cursorLikeCount,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(required = false) Long interestId
    ){
        Pageable pageable = PageRequest.of(0,size);
        return ResponseEntity.ok(
                boardService.recommendBoard(pageable, cursorLikeCount, cursorId, interestId, userDetails.getUsername()));
    }

    // 게시글 검색
    //cursorId -> boardId 최신순
    @GetMapping("/search")
    public ResponseEntity<List<BoardRecommendResonse>> searchBoard(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long cursorId,
            @RequestParam(required = false) String word,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        Pageable pageable = PageRequest.of(0,size);
        return ResponseEntity.ok(boardService.searchBoard(pageable, cursorId, word, userDetails.getUsername()));
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable Long boardId,
            @RequestPart("board") BoardRequest boardRequest,
            @RequestPart(value = "boardImages", required = false) List<MultipartFile> newFiles,
            @AuthenticationPrincipal UserDetails userDetails) {
        BoardResponse boardResponse = boardService.updateBoard(boardId, boardRequest, userDetails.getUsername(), newFiles);

        return ResponseEntity.ok(boardResponse);
    }

    // 유저 게시글 조회
    @GetMapping("/user")
    public ResponseEntity<List<BoardResponse>> getUserBoard(@AuthenticationPrincipal UserDetails userDetails){
        List<BoardResponse> boardResponses = boardService.getBoardByUser(userDetails.getUsername());
        return ResponseEntity.ok(boardResponses);
    }

    // 내 프로필 게시글 조회
    @GetMapping("/profile")
    public ResponseEntity<List<BoardProfileResponse>> getUserProfileBoard(@AuthenticationPrincipal UserDetails userDetails){
        List<BoardProfileResponse> responses = boardService.getProfileBoardByUser(userDetails.getUsername());
        return ResponseEntity.ok(responses);
    }

    // 다른 사람 프로필 게시글 조회
    @GetMapping("/{personalId}/profile")
    public ResponseEntity<List<BoardProfileResponse>> getOtherUserProfileBoard(@PathVariable String personalId){
        List<BoardProfileResponse> responses = boardService.getProfileBoardByUser(personalId);
        return ResponseEntity.ok(responses);
    }

    // 프로필 게시글 위치 수정
    @PatchMapping("/profile/update")
    public ResponseEntity<String> updateUserProfileBoard(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<BoardProfileUpdateRequest> requests){
        boardService.updateUserProfileBoard(userDetails.getUsername(), requests);
        return ResponseEntity.ok("Success to update profile boards");
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long boardId){
        boardService.deleteBoard(boardId);
        return ResponseEntity.ok("Success to delete board");
    }
}
