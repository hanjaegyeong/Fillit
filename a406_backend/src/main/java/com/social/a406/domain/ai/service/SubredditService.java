package com.social.a406.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.ai.entity.Subreddit;
import com.social.a406.domain.ai.entity.UserSubredditMapping;
import com.social.a406.domain.ai.repository.UserSubredditMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class SubredditService {
    private final UserSubredditMappingRepository userSubredditMappingRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public Subreddit getRandomUserSubreddit(String nickname) {
        // 특정 유저와 매핑된 서브레딧 가져오기
        List<UserSubredditMapping> mappings = userSubredditMappingRepository.findByUser_Nickname(nickname);

        if (mappings.isEmpty()) {
            throw new IllegalStateException("No subreddit mappings found for nickname: " + nickname);
        }

        // 랜덤하게 하나의 매핑 선택
        UserSubredditMapping randomMapping = getRandomElement(mappings);

        // 선택된 Subreddit 반환
        return randomMapping.getSubreddit();
    }

    public String getRandomHotPost(String subredditName) {
        String url = String.format("https://www.reddit.com/r/%s/hot.json?limit=10", subredditName);

        try {
            // API 호출
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = new ObjectMapper().readTree(response);

            // 핫 게시글 제목 추출
            List<JsonNode> hotPosts = new ArrayList<>();
            jsonNode.path("data").path("children").forEach(node -> {
                JsonNode data = node.path("data");
                if (data.has("title") && !data.path("title").asText().isEmpty()) {
                    hotPosts.add(data);
                }
            });

            // 랜덤한 핫 게시글 선택
            if (!hotPosts.isEmpty()) {
                JsonNode randomPost = getRandomElement(hotPosts);
                String title = randomPost.path("title").asText("No Title Available");
                String author = randomPost.path("author").asText("Anonymous");
                int upvotes = randomPost.path("ups").asInt(0);

                return String.format("Title: %s\nAuthor: %s\nUpvotes: %d", title, author, upvotes);
            } else {
                throw new IllegalStateException("No valid hot posts found for subreddit: " + subredditName);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch hot posts from subreddit: " + subredditName, e);
        }
    }

    private <T> T getRandomElement(List<T> list) {
        Random random = new Random();
        return list.get(random.nextInt(list.size()));
    }
}
