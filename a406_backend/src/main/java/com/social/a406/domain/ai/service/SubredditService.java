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

    private static final String REDDIT_URL = "https://www.reddit.com/r/%s/hot.json?limit=30";
    private static final String SUBREDDIT_PROMPT_TEMPLATE = "Explore the subreddit '%s'. Here's a trending topic:\n\n%s\n\nWrite a social media post inspired by this.";
    private static final String PROMPT_SUFFIX = "Please respond within 350 characters." +
            "Then, write '!@@@' at the end and send the representative theme of your post in one word without spacing. If it's related to a specific person, say it clearly, such as the person, the name of the place, the name of the game, and the name of the TV show if it's related to a specific TV show.";

    /**
     * 서브레딧 기반 프롬프트 생성 (동기 변환)
     */
    public String createSubredditPrompt(String personalId) {
        String subreddit = getRandomUserSubreddit(personalId);
        String hotPost = getRandomHotPost(subreddit);

        return String.format(SUBREDDIT_PROMPT_TEMPLATE, subreddit, hotPost) + PROMPT_SUFFIX;
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

    private String getRandomHotPost(String subredditName) {
        String url = String.format(REDDIT_URL, subredditName);

        try {
            JsonNode jsonNode = restTemplate.getForObject(url, JsonNode.class);
            return extractRandomPostInfo(jsonNode);
        } catch (Exception e) {
            System.err.println("Reddit API 요청 실패: " + e.getMessage());
            return "No Title Available | No Description Available";
        }
    }

    /**
     * JSON 응답에서 랜덤한 게시글 제목과 설명을 추출
     */
    private String extractRandomPostInfo(JsonNode jsonNode) {
        if (jsonNode == null || !jsonNode.has("data")) {
            return "No Title Available | No Description Available";
        }

        List<JsonNode> hotPosts = jsonNode.path("data").path("children").findValues("data");

        if (hotPosts.isEmpty()) {
            return "No Title Available | No Description Available";
        }

        JsonNode randomPost = hotPosts.get(new Random().nextInt(hotPosts.size()));

        // 제목 추출
        String title = randomPost.path("title").asText("No Title Available");

        // 설명 추출 (secure_media.oembed.description이 있을 경우)
        String description = randomPost.path("secure_media")
                .path("oembed")
                .path("description")
                .asText("No Description Available");

        return title + " | " + description;
    }
}
