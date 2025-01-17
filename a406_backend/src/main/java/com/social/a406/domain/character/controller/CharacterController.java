package com.social.a406.domain.character.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.character.entity.Character;
import com.social.a406.domain.character.service.CharacterService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class CharacterController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final CharacterService characterService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 프롬프트 끝에 항상 추가할 문구를 상수화
    private static final String PROMPT_SUFFIX = "Please respond within 500 characters.";

    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @PostMapping("/generate")
    public String generateContent(@RequestParam String nickname, @RequestParam String apiKey, @RequestBody Map<String, String> body) {
        // 캐릭터 정보 조회
        Character character = characterService.findByNickname(nickname).get();
        if (character == null) {
            throw new IllegalArgumentException("Character not found with nickname: " + nickname);
        }

        // 메인 프롬프트와 추가 프롬프트 결합 및 마지막 문장 추가
        String prompt = body.getOrDefault("prompt", "");
        String finalPrompt = character.getMainPrompt() + " " + prompt + " " + PROMPT_SUFFIX;

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
        try {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode partsNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            return partsNode.asText(); // `text` 값 반환
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response: " + e.getMessage());
        }
    }
}
