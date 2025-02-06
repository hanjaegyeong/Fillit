package com.social.a406.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AIService {

    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private static final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    private static final String PROMPT_SUFFIX = "Please respond within 350 characters.";
    private static final String DEFAULT_POST_PROMPT = "Write a social media post about your day today.";
    private static final String PROMPT_CHAT = "You are ‘fillip’, a chatty English teacher from the US. Please answer the following questions in English. Please only answer questions related to English.";
    private static final String PROMPT_COMMET_RPLY = "A user has left a \\\"%s\\\" on a \\\"%s\\\", and now you need to write a relevant and natural-sounding reply to that comment.";
    /**
     * 일반 AI 게시글 프롬프트 생성
     */
    public String createBoardPrompt(String personalId) {
        return null;
    }

    /**
     * AI 댓글 프롬프트 생성
     */
    public String createCommentPrompt(String boardContent, String boardAuthorPersonalId) {
        return String.format("Author: %s\nContent: %s\nPlease write a reply to this post.", boardAuthorPersonalId, boardContent);
    }

    /**
     * AI 챗봇 답장 생성
     */
    public String generateChat(String message) {
        String finalPrompt = PROMPT_CHAT + " " + message + " " + PROMPT_SUFFIX;
        return generateContent(finalPrompt);
    }

    /**
     * AI 콘텐츠 생성
     */
    public String generateContent(String prompt) {
        try {
            HttpHeaders headers = createHeaders();
            String requestBody = buildRequestBody(prompt);
            ResponseEntity<String> response = restTemplate.exchange(
                    BASE_URL + "?key=" + geminiApiKey,
                    HttpMethod.POST,
                    new HttpEntity<>(requestBody, headers),
                    String.class
            );

            return parseResponse(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("AI 호출 중 오류 발생: " + e.getMessage());
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private String buildRequestBody(String prompt) {
        return """
            {
                "contents": [
                    { "parts": [{ "text": "%s" }] }
                ]
            }
            """.formatted(prompt);
    }

    private String parseResponse(String responseBody) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);

            // 기존 코드에서 정상적으로 작동했던 AI 응답 파싱 방식으로 복원
            JsonNode candidatesNode = rootNode.path("candidates");
            if (candidatesNode.isArray() && candidatesNode.size() > 0) {
                JsonNode contentNode = candidatesNode.get(0).path("content").path("parts").get(0).path("text");
                return contentNode.asText();
            }

            throw new RuntimeException("AI 응답에서 적절한 content를 찾을 수 없음: " + responseBody);
        } catch (Exception e) {
            throw new RuntimeException("AI 응답 파싱 실패: " + e.getMessage());
        }
    }

    public String createCommentReplyPrompt(String origin, String content, String personalId) {
        User aiUser = userService.getUserByPersonalId(personalId);
        return String.format(aiUser.getMainPrompt()+PROMPT_COMMET_RPLY, content, origin) + PROMPT_SUFFIX;
    }
}
