package com.social.a406.domain.ai.controller;

import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.ai.service.AIFacadeService;
import com.social.a406.domain.comment.dto.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AIFacadeService aiFacadeService;

    // 일반 AI 게시글 생성
    @PostMapping("/generate/board/normal")
    public ResponseEntity<BoardResponse> generateBoard(@RequestParam String nickname, @RequestParam String apiKey,
                                                       @RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("prompt", "");
        BoardResponse response = aiFacadeService.generateAndSaveBoard(nickname, apiKey, prompt);
        return ResponseEntity.status(201).body(response);
    }

    // 특정 게시글에 AI 댓글 생성
    @PostMapping("/generate/comment")
    public ResponseEntity<CommentResponse> generateComment(
            @RequestParam Long boardId,
            @RequestParam String nickname, //작성자
            @RequestParam String apiKey) {

        CommentResponse response = aiFacadeService.generateAndSaveComment(boardId, nickname, apiKey);

        return ResponseEntity.status(201).body(response);
    }

    // 레딧 AI 게시글 생성
    @GetMapping("/generate/board/reddit")
    public ResponseEntity<BoardResponse> generateBoardFromSubredditHotPost(@RequestParam String nickname, @RequestParam String apiKey) {
        BoardResponse response = aiFacadeService.generateBoardUsingSubredditHotPost(nickname, apiKey);

        return ResponseEntity.status(201).body(response);
    }
}
