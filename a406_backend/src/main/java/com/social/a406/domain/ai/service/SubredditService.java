package com.social.a406.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.social.a406.domain.ai.entity.UserSubredditMapping;
import com.social.a406.domain.ai.repository.UserSubredditMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SubredditService {
    private final UserSubredditMappingRepository userSubredditMappingRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String REDDIT_URL = "https://www.reddit.com/r/%s/hot.json?limit=10";
    private static final String SUBREDDIT_PROMPT_TEMPLATE = "Explore the subreddit '%s'. Here's a trending topic:\n\n%s\n\nWrite a social media post inspired by this.";
    private static final String PROMPT_SUFFIX = "Please respond within 350 characters.";
    private static final String PROMPT_IMAGE_SUFFIX = "Then, write '!@@@' at the end and send the representative theme of your post in one word without spacing. If it's related to a specific person, say it clearly, such as the person, the name of the place, the name of the game, and the name of the TV show if it's related to a specific TV show.";

    /**
     * 서브레딧 기반 프롬프트 생성 (동기 변환)
     */
    public String createSubredditPrompt(String personalId, boolean includeImage) {
        String subreddit = getRandomUserSubreddit(personalId);
        String hotPost = getRandomHotPost(subreddit);

        String prompt = String.format(SUBREDDIT_PROMPT_TEMPLATE, subreddit, hotPost) + PROMPT_SUFFIX;
        return includeImage ? prompt + PROMPT_IMAGE_SUFFIX : prompt;
    }

    /**
     * 랜덤한 사용자의 서브레딧 가져오기 (동기 변환)
     */
    private String getRandomUserSubreddit(String personalId) {
        List<UserSubredditMapping> mappings = userSubredditMappingRepository.findByUser_PersonalId(personalId);
        if (mappings.isEmpty()) {
            throw new RuntimeException("No subreddit found for user: " + personalId);
        }
        return mappings.get(new Random().nextInt(mappings.size())).getSubreddit().getName();
    }

    /**
     * 특정 서브레딧의 랜덤 핫 게시글 가져오기 (WebClient 동기 변환)
     */
    private String getRandomHotPost(String subredditName) {
        String url = String.format(REDDIT_URL, subredditName);

        try {
            JsonNode jsonNode = restTemplate.getForObject(url, JsonNode.class);
            return extractRandomPostTitle(jsonNode);
        } catch (Exception e) {
            System.err.println("Reddit API 요청 실패: " + e.getMessage());
            return "No Title Available";
        }
    }

    /**
     * JSON 응답에서 랜덤한 게시글 제목 추출
     */
    private String extractRandomPostTitle(JsonNode jsonNode) {
        if (jsonNode == null || !jsonNode.has("data")) {
            return "No Title Available";
        }
        List<JsonNode> hotPosts = jsonNode.path("data").path("children").findValues("data");
        return hotPosts.isEmpty() ? "No Title Available" :
                hotPosts.get(new Random().nextInt(hotPosts.size())).path("title").asText("No Title Available");
    }
}
