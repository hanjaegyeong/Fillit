package com.social.a406.domain.ai.controller;

import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.ai.service.AIFacadeService;
import com.social.a406.domain.board.service.BoardService;
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
    private final BoardService boardService;

    // 일반 AI 게시글 생성
    @PostMapping("/generate/board/normal")
    public ResponseEntity<BoardResponse> generateBoard(@RequestParam String personalId,
                                                       @RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("prompt", "");
        BoardResponse response = aiFacadeService.generateAndSaveBoard(personalId, prompt);
        return ResponseEntity.status(201).body(response);
    }

    // 특정 게시글에 AI 댓글 생성
    @GetMapping("/generate/comment")
    public ResponseEntity<CommentResponse> generateComment(
            @RequestParam Long boardId,
            @RequestParam String personalId // 댓글 작성 AI
            ) {

        CommentResponse response = aiFacadeService.generateAndSaveComment(boardId, personalId);

        return ResponseEntity.status(201).body(response);
    }

    // 랜덤 게시글에 랜덤 AI 댓글 생성
    @GetMapping("/generate/random/comment")
    public ResponseEntity<CommentResponse> generateRandomAiComment() {
        String randomPersonalId = userService.getRandomUserWithMainPrompt();

        // 본인 댓글 단 게시글 / 본인 게시글 제외한 랜덤 게시글 ID 가져오기
        Long randomBoardId = boardService.getRandomAvailableBoardIdExcludingUser(randomPersonalId);
        if (randomBoardId == null) {
            return ResponseEntity.status(404).body(null); // 사용할 수 있는 게시글이 없는 경우
        }

        CommentResponse response = aiFacadeService.generateAndSaveComment(randomBoardId, randomPersonalId);

        return ResponseEntity.status(201).body(response);
    }

    // 레딧 AI 게시글 생성
    @GetMapping("/generate/board/reddit")
    public ResponseEntity<BoardResponse> generateBoardFromSubredditHotPost(@RequestParam String personalId) {
        BoardResponse response = aiFacadeService.generateBoardUsingSubredditHotPost(personalId);

        return ResponseEntity.status(201).body(response);
    }

    // 유튜브 AI 게시글 생성
    @GetMapping("/generate/board/youtube")
    public ResponseEntity<BoardResponse> generateBoardFromYoutube(@RequestParam String personalId){
        BoardResponse response = aiFacadeService.generateBoardUsingYoutube(personalId);

        return ResponseEntity.status(201).body(response);
    }

    // AI 기반 랜덤 ai유저 랜덤 게시글 생성 컨트롤러
    @GetMapping("/generate/random/board")
    public ResponseEntity<BoardResponse> generateBoard() {
        String randomPersonalId = userService.getRandomUserWithMainPrompt();

        // 랜덤으로 subreddit(0) / youtube(1) / normal 일상글(2) 중 선택
        int choice = new Random().nextInt(3);

        BoardResponse response;

        switch (choice) {
            case 0:
                response = aiFacadeService.generateBoardUsingSubredditHotPost(randomPersonalId);
                break;
            case 1:
                response = aiFacadeService.generateBoardUsingYoutube(randomPersonalId);
                break;
            default:
                String prompt = "Write a social media post about your day today.";
                response = aiFacadeService.generateAndSaveBoard(randomPersonalId, prompt);
                break;
        }

        return ResponseEntity.status(201).body(response);
    }
}
