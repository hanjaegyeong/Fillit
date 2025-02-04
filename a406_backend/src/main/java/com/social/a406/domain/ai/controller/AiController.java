package com.social.a406.domain.ai.controller;

import com.social.a406.domain.ai.service.FlickrService;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.ai.service.AIFacadeService;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Random;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AIFacadeService aiFacadeService;
    private final UserService userService;
    private final BoardService boardService;
    private final FlickrService flickrService;

    /**
     * AI가 일반 게시글 생성
     */
    @GetMapping("/generate/board")
    public ResponseEntity<BoardResponse> generateBoard(@RequestParam String personalId) {
        BoardResponse response = aiFacadeService.generateAndSaveBoard(personalId, false);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * AI가 특정 게시글에 댓글 생성
     */
    @GetMapping("/generate/comment")
    public ResponseEntity<CommentResponse> generateComment(
            @RequestParam Long boardId,
            @RequestParam String personalId
    ) {
        CommentResponse response = aiFacadeService.generateAndSaveComment(boardId, personalId);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * 랜덤 게시글에 랜덤 AI 댓글 생성
     */
    @GetMapping("/generate/random/comment")
    public ResponseEntity<CommentResponse> generateRandomAiComment() {
        String randomPersonalId = userService.getRandomUserWithMainPrompt();
        Long randomBoardId = boardService.getRandomAvailableBoardIdExcludingUser(randomPersonalId);

        if (randomBoardId == null) {
            return ResponseEntity.status(404).build();
        }

        CommentResponse response = aiFacadeService.generateAndSaveComment(randomBoardId, randomPersonalId);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * AI가 랜덤 게시글 생성 (일반, 서브레딧, 유튜브 기반)
     * @param includeImage
     * @return BoardResponse
     */
    @GetMapping("/generate/random/board")
    public ResponseEntity<BoardResponse> generateRandomBoard(
            @RequestParam(required = false, defaultValue = "false") boolean includeImage) {
        String randomPersonalId = userService.getRandomUserWithMainPrompt();
        int choice = new Random().nextInt(3); // 0, 1, 2 중 랜덤 선택

        BoardResponse response;
        switch (choice) {
            case 0:
                response = aiFacadeService.generateBoardUsingSubreddit(randomPersonalId, includeImage);
                break;
            case 1:
                response = aiFacadeService.generateBoardUsingYoutube(randomPersonalId, includeImage);
                break;
            default:
                response = aiFacadeService.generateAndSaveBoard(randomPersonalId, includeImage);
                break;
        }

        //여기부터 퍼사드의 개별 이미지 서비스로 보내기
        if (includeImage) {
            String[] content = aiFacadeService.parseKeywordAndUpdateContent(response.getContent());
            response.setContent(content[0]);
            String imageUrl = flickrService.getRandomImageUrl(content[1]); //키워드 삽입
            response.setImageUrls(Collections.singletonList(imageUrl));
            return ResponseEntity.status(201).body(response);
        }

        return ResponseEntity.status(201).body(response);
    }
}
