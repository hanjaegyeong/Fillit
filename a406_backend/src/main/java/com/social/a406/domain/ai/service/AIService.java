package com.social.a406.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AIService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String PROMPT_SUFFIX = "Please respond within 500 characters.";

    // gemini-1.5-flash 모델 생성형AI API 호출
    public String generateContent(String nickname, String apiKey, String additionalPrompt) {
        User ai = userService.getUserByNickname(nickname);

        String finalPrompt = ai.getMainPrompt() + " " + additionalPrompt + " " + PROMPT_SUFFIX;

        // API 호출 준비
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String requestBody = "{ \"contents\": [ { \"parts\": [ { \"text\": \"" + finalPrompt + "\" } ] } ] }";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // API 호출
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

        return parseGeneratedContent(response.getBody());
    }

    // 생성형 API 응답의 content만 파싱
    private String parseGeneratedContent(String responseBody) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);
            return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response: " + e.getMessage());
        }
    }
}
