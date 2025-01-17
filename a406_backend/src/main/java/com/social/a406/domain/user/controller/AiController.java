package com.social.a406.domain.user.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.service.UserService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AiController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final BoardService boardService; // BoardService 주입

    // 프롬프트 끝에 항상 추가할 문구를 상수화
    private static final String PROMPT_SUFFIX = "Please respond within 500 characters.";

    public AiController(UserService userService, BoardService boardService) {
        this.userService = userService;
        this.boardService = boardService;
    }

    @PostMapping("/generate")
    public ResponseEntity<BoardResponse> generateBoard(@RequestParam String nickname, @RequestParam String apiKey,
                                                       @RequestBody Map<String, String> body) {
        // 캐릭터 정보 조회
        User ai = userService.getUserByNickname(nickname);

        // 메인 프롬프트와 추가 프롬프트 결합 및 마지막 문장 추가
        String prompt = body.getOrDefault("prompt", "");
        String finalPrompt = ai.getMainPrompt() + " " + prompt + " " + PROMPT_SUFFIX;

        // API 호출 준비
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 요청 바디 생성
        String requestBody = "{ \"contents\": [ { \"parts\": [ { \"text\": \"" + finalPrompt + "\" } ] } ] }";

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // API 호출
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

        // JSON 응답 파싱
        String generatedContent;
        try {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            generatedContent = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response: " + e.getMessage());
        }

        // 생성된 텍스트를 이용해 게시글 업로드
        BoardRequest boardRequest = BoardRequest.builder()
                .content(generatedContent)
                .build();

        BoardResponse boardResponse = boardService.createAiBoard(boardRequest, nickname);

        return ResponseEntity.status(HttpStatus.CREATED).body(boardResponse);
    }
}
