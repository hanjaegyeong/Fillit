package com.social.a406.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.social.a406.domain.ai.entity.Subreddit;
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

    private static final String SUBREDDIT_PROMPT_TEMPLATE = "Explore the subreddit '%s'. Here's a trending topic:\n\n%s\n\nWrite a social media post inspired by this.";
    private static final String PROMPT_SUFFIX = "Please respond within 350 characters.";
    private static final String PROMPT_IMAGE_SUFFIX = "Then, write '!@@@' at the end and send the representative theme of your post in one word without spacing. If it's related to a specific person, say it clearly, such as the person, the name of the place, the name of the game, and the name of the TV show if it's related to a specific TV show.";

    /**
     * 서브레딧 기반 프롬프트 생성
     */
    public String createSubredditPrompt(String personalId, boolean includeImage) {
        Subreddit subreddit = getRandomUserSubreddit(personalId);
        String hotPost = getRandomHotPost(subreddit.getName());
        if (includeImage) {
            return String.format(SUBREDDIT_PROMPT_TEMPLATE, subreddit.getName(), hotPost) + PROMPT_SUFFIX + PROMPT_IMAGE_SUFFIX;
        }
        return String.format(SUBREDDIT_PROMPT_TEMPLATE, subreddit.getName(), hotPost) + PROMPT_SUFFIX;
    }

    private Subreddit getRandomUserSubreddit(String personalId) {
        List<UserSubredditMapping> mappings = userSubredditMappingRepository.findByUser_PersonalId(personalId);
        return mappings.get(new Random().nextInt(mappings.size())).getSubreddit();
    }

    private String getRandomHotPost(String subredditName) {
        String url = String.format("https://www.reddit.com/r/%s/hot.json?limit=10", subredditName);
        JsonNode jsonNode = restTemplate.getForObject(url, JsonNode.class);
        List<JsonNode> hotPosts = jsonNode.path("data").path("children").findValues("data");
        return hotPosts.get(new Random().nextInt(hotPosts.size())).path("title").asText("No Title Available");
    }
}
