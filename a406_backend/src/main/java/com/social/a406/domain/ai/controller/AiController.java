package com.social.a406.domain.ai.controller;

import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.ai.service.AIFacadeService;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AIFacadeService aiFacadeService;
    private final UserService userService;

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

    // 유튜브 AI 게시글 생성
    @GetMapping("/generate/board/youtube")
    public ResponseEntity<BoardResponse> generateBoardFromYoutube(@RequestParam String nickname, @RequestParam String apiKey){
        BoardResponse response = aiFacadeService.generateBoardUsingYoutube(nickname, apiKey);

        return ResponseEntity.status(201).body(response);
    }

    // AI 기반 게시글 생성 컨트롤러
    @GetMapping("/generate/board")
    public ResponseEntity<BoardResponse> generateBoard(@RequestParam String apiKey) {
        // 랜덤 사용자 가져오기
        String nickname = userService.getRandomUserWithMainPrompt();

        // 랜덤으로 subreddit 또는 youtube 중 선택
        boolean useSubreddit = new Random().nextBoolean();

        BoardResponse response;
        if (useSubreddit) {
            response = aiFacadeService.generateBoardUsingSubredditHotPost(nickname, apiKey);
        } else {
            response = aiFacadeService.generateBoardUsingYoutube(nickname, apiKey);
        }

        return ResponseEntity.status(201).body(response);
    }
}
