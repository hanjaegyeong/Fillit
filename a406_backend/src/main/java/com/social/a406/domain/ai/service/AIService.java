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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AIService {

    private final UserService userService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${GEMINI_API_KEY}")
    private String geminiApiKey;

    private static final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    private static final String PROMPT_SUFFIX = "Please respond within 350 characters." +
            " Then, write '!@@@' at the end and send the representative theme of your post in one word without spacing. If it's related to a specific person, say it clearly, such as the person, the name of the place, the name of the game, and the name of the TV show if it's related to a specific TV show.";
    private static final String DEFAULT_POST_PROMPT = "Write a social media post about your day today.";
    private static final String PROMPT_CHAT = "You are ‘fillip’, a chatty English teacher from the US. Please answer the following questions in English. Please only answer questions related to English.";
    private static final String PROMPT_COMMET_RPLY = "A user has left a \\\"%s\\\" on a \\\"%s\\\", and now you need to write a relevant and natural-sounding reply to that comment.";
    private static final String CHAT_PROMPT_SUFFIX = "Please respond within 350 characters. And you can skip greetings";
    /**
     * 일반 AI 게시글 프롬프트 생성
     */
    public String createBoardPrompt(String personalId) {
        // aiUser의 mainPrompt를 가져옴
        User aiUser = userService.getUserByPersonalId(personalId);

        // 현재 시각에 따른 시간 카테고리
        Random random = new Random();
        String timeCategory = getTimeCategory();
        if(random.nextInt(10) >= 7) timeCategory = null; // 일정확률로 시간과 관계없는 메세지가 생성되도록
        System.out.println("Date Time: "+ timeCategory);

        // 랜덤 상황 선택
        String randomSituation = SITUATIONS[random.nextInt(SITUATIONS.length)];
        if(random.nextInt(10) >= 7) randomSituation = "randomSituation"; // 일정확률로 관심사에 대한 메세지가 생성되도록
        System.out.println("Situation: "+ randomSituation);


        // 예시 프롬프트: 페르소나 + 시간 정보 + 상황 + 기본 요청사항 + 추가 요청사항
        return aiUser.getMainPrompt()
                + " It is " + timeCategory + "."
                + " " + randomSituation + "."
                + " " + DEFAULT_POST_PROMPT
                + " " + PROMPT_SUFFIX;
    }

    /**
     * AI 댓글 프롬프트 생성
     */
    public String createCommentPrompt(String boardContent, String boardAuthorPersonalId, User aiUser) {
        return String.format("Author: %s\nContent: %s\n %s Please write a reply to this post. Please respond within 60 characters.", boardAuthorPersonalId, boardContent, aiUser.getMainPrompt());
    }

    /**
     * AI 챗봇 답장 생성
     */
    public String generateChat(String message) {
        String finalPrompt = PROMPT_CHAT + " " + message + " " + CHAT_PROMPT_SUFFIX;
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
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    )
            );
            return objectMapper.writeValueAsString(requestBody);
        } catch (Exception e) {
            throw new RuntimeException("JSON 변환 오류: " + e.getMessage());
        }
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
        return String.format(aiUser.getMainPrompt() + PROMPT_COMMET_RPLY, content, origin) + "Please respond within 50 characters.";
    }

    // 100가지 간단한 상황 배열 (영어로)
    private static final String[] SITUATIONS = {
            "Bad weather situation",
            "Having a meal",
            "On a date",
            "Meeting a friend",
            "Heading out for a meal appointment",
            "Weekend with no plans",
            "A busy day at work",
            "Being late for work",
            "Spotting a stray cat",
            "Catching up with family",
            "Taking a walk in the park",
            "Working from home",
            "Attending a social event",
            "Running errands",
            "Having a quiet day indoors",
            "A spontaneous road trip",
            "Dealing with unexpected delays",
            "Overcoming a small setback",
            "A relaxing day at the beach",
            "Preparing for an important meeting",
            "Feeling under the weather",
            "A day filled with surprises",
            "Just finished a workout",
            "Starting a new hobby",
            "Exploring a new part of town",
            "A day of self-reflection",
            "An unplanned adventure",
            "Experiencing heavy traffic",
            "A day of minor mishaps",
            "Catching a beautiful sunset",
            "An unexpected encounter",
            "A day of creative inspiration",
            "Stuck in a long queue",
            "A day at the library",
            "Volunteering for a cause",
            "A quiet morning at home",
            "A sudden change in plans",
            "Learning something new",
            "Spending time with a pet",
            "A day full of laughter",
            "An unanticipated visit",
            "A moment of solitude",
            "A day of rediscovery",
            "Attending a workshop",
            "Feeling nostalgic",
            "A day with clear skies",
            "Enjoying a cup of coffee",
            "An afternoon in the garden",
            "Navigating through city crowds",
            "A relaxing spa day",
            "Dealing with hectic meetings",
            "Trying a new restaurant",
            "An impromptu shopping trip",
            "Catching up on sleep",
            "A day of surprising challenges",
            "Experiencing mild traffic",
            "A calm and peaceful day",
            "An unusually quiet day",
            "A day of routine tasks",
            "Handling a minor crisis",
            "A fun day at the home",
            "Unexpectedly running into an old friend",
            "A busy day running errands",
            "A day full of positive energy",
            "Overcoming a morning mishap",
            "A day of simple pleasures",
            "Feeling inspired by art",
            "An ordinary day turned interesting",
            "Enjoying the local market",
            "A day spent reading",
            "Participating in a community event",
            "A day of unplanned fun",
            "A reflective evening walk",
            "A day with a surprise twist",
            "Working on a creative project",
            "A busy day with unexpected tasks",
            "A day that started off slow",
            "A delightful mid-day break",
            "A day filled with small wins",
            "Experiencing an unusual morning",
            "A quick catch-up with a neighbor",
            "A day of unexpected calls",
            "A simple yet eventful day",
            "A day with a minor setback",
            "A pleasant encounter on the street",
            "A spontaneous coffee break",
            "A day that defied expectations",
            "A typical workday with a twist",
            "An impromptu visit to a local spot",
            "A day marked by little surprises",
            "Catching up with an old colleague",
            "A quiet evening at home",
            "An early evening stroll",
            "A simple dinner with family",
            "An impromptu game night",
            "An interesting conversation with a stranger",
            "A day with a light drizzle",
            "A day to relax and recharge",
            "A quick lunch break in the city",
            "A day of small adventures"
    };

    /**
     * 현재 시간을 기준으로 아래와 같이 분류합니다.
     * - 00:00 ~ 04:59 : dawn
     * - 05:00 ~ 07:59 : early morning
     * - 08:00 ~ 10:59 : morning
     * - 11:00 ~ 12:59 : lunch
     * - 13:00 ~ 16:59 : afternoon
     * - 17:00 ~ 20:59 : evening
     * - 21:00 ~ 23:59 : night
     */
    public static String getTimeCategory() {
        int hour = LocalDateTime.now().getHour();
        System.out.println("This is Time : " + hour);
        if (hour >= 0 && hour < 5) {
            return "dawn";
        } else if (hour >= 5 && hour < 8) {
            return "early morning";
        } else if (hour >= 8 && hour < 11) {
            return "morning";
        } else if (hour >= 11 && hour < 13) {
            return "lunch";
        } else if (hour >= 13 && hour < 17) {
            return "afternoon";
        } else if (hour >= 17 && hour < 21) {
            return "evening";
        } else {
            return "night";
        }
    }

}
