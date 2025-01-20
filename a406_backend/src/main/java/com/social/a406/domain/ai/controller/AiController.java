package com.social.a406.domain.ai.controller;

import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.ai.service.AIFacadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AIFacadeService aiFacadeService;

    @PostMapping("/generate")
    public ResponseEntity<BoardResponse> generateBoard(@RequestParam String nickname, @RequestParam String apiKey,
                                                       @RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("prompt", "");
        BoardResponse response = aiFacadeService.generateAndSaveBoard(nickname, apiKey, prompt);
        return ResponseEntity.status(201).body(response);
    }
}
