package com.social.a406.domain.hotissue.service;

import com.social.a406.domain.hotissue.entity.Category;
import com.social.a406.domain.hotissue.entity.Youtube;
import com.social.a406.domain.hotissue.repository.CategoryRepository;
import com.social.a406.domain.hotissue.repository.YoutubeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class YoutubeService {

    private final RestTemplate restTemplate;
    private final YoutubeRepository youtubeRepository;
    private final CategoryRepository categoryRepository;

    public YoutubeService(RestTemplate restTemplate, YoutubeRepository youtubeRepository, CategoryRepository categoryRepository) {
        this.restTemplate = restTemplate;
        this.youtubeRepository = youtubeRepository;
        this.categoryRepository = categoryRepository;
    }

    @Value("${youtube.api.url}")
    private String YOUTUBE_API_URL;
    @Value("${youtube.api.key}")
    private String API_KEY;

    private final int DESCRIPTION_MAX_LENGTH = 950;


    public List<Youtube> getPopularVideos(int maxResults) {
        // API 요청 URL 생성
        String url = UriComponentsBuilder.fromHttpUrl(YOUTUBE_API_URL)
                .queryParam("part", "snippet,topicDetails")
                .queryParam("chart", "mostPopular")
                .queryParam("regionCode", "US")
                .queryParam("maxResults", maxResults)
                .queryParam("key", API_KEY)
                .toUriString();

        // API 호출 및 결과 처리
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        List<Map<String, Object>> items = filter(response);

        List<Youtube> youtubeList = items.stream()
                .map(this::convertToYoutubeEntity)  // 엔티티로 변환
                .peek(youtubeRepository::save)      // 저장
                .collect(Collectors.toList());

        return youtubeList;
    }

    // YouTube 엔티티 생성 로직 분리
    private Youtube convertToYoutubeEntity(Map<String, Object> item) {
        String description = extractDescription((String) item.get("description"));
        String categoryId = (String) item.get("categoryId");
        Integer categoryIdInt = Integer.parseInt(categoryId);
        String categoryName = getCategoryNameById(categoryIdInt);
        Youtube youtube = Youtube.builder()
                .url((String) item.get("url"))
                .publishedAt((String) item.get("publishedAt"))
                .description(description)
                .title((String) item.get("title"))
                .topicCategory((String) item.get("topicCategory"))
                .category(categoryName)
                .channelTitle((String) item.get("channelTitle"))
                .build();
        String prompt = generatePrompt(youtube);

        return Youtube.builder()
                .url((String) item.get("url"))
                .publishedAt((String) item.get("publishedAt"))
                .description(description)
                .title((String) item.get("title"))
                .topicCategory((String) item.get("topicCategory"))
                .category(categoryName)
                .channelTitle((String) item.get("channelTitle"))
                .prompt(prompt)
                .build();
    }

    // 설명(description) 문자열 처리 분리
    private String extractDescription(String description) {
        if (description == null) return null;

        int newlineIndex = description.indexOf("\n");
        if (newlineIndex != -1) {
            description = description.substring(0, newlineIndex);
        }

        description = description.replace("\"", "'");

        if (description.length() > DESCRIPTION_MAX_LENGTH) {
            description = description.substring(0, DESCRIPTION_MAX_LENGTH) + "...";
        }

        return description;
    }

    public List<Map<String, Object>> filter(Map<String, Object> response){
        if (response != null && response.containsKey("items")) {
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");

            // 필요한 정보만 추출
            return items.stream().map(item -> {
                Map<String, Object> filteredData = new HashMap<>();

                // snippet에서 필요한 정보 추출
                Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
                if (snippet != null) {
                    filteredData.put("publishedAt", snippet.get("publishedAt"));
                    filteredData.put("title", snippet.get("title"));
                    filteredData.put("description", snippet.get("description"));
                    filteredData.put("channelTitle", snippet.get("channelTitle"));
                    filteredData.put("categoryId", snippet.get("categoryId"));

                    // 영상 URL 생성
                    String videoId = (String) item.get("id");
                    String videoUrl = "https://www.youtube.com/watch?v=" + videoId;
                    filteredData.put("url", videoUrl);
                }

                // topicDetails에서 필요한 정보 추출
                Map<String, Object> topicDetails = (Map<String, Object>) item.get("topicDetails");
                if (topicDetails != null) {
                    List<String> topicCategories = (List<String>) topicDetails.get("topicCategories");
                    if (topicCategories != null && !topicCategories.isEmpty()) {
                        String firstTopicCategoryUrl = topicCategories.get(0);
                        String categoryKeyword = firstTopicCategoryUrl.replace("https://en.wikipedia.org/wiki/", "");
                        filteredData.put("topicCategory", categoryKeyword);
                    }
                }

                return filteredData;
            }).collect(Collectors.toList());
        } else {
            throw new RuntimeException("Failed to fetch YouTube data");
        }
    }

    private String getCategoryNameById(Integer categoryId) {
        // 카테고리 ID로 categoryName 조회
        Category category = categoryRepository.findByCategoryId(categoryId);
        if (category != null) {
            return category.getName();
        } else {
            return "Unknown";  // 카테고리가 없다면 "Unknown"을 반환
        }
    }

    // Method to generate the social media post prompt
    private String generatePrompt(Youtube youtube) {
        String title = youtube.getTitle();
        String url = youtube.getUrl();
        String description = youtube.getDescription();
        String category = youtube.getCategory();
        String topicCategory = youtube.getTopicCategory();
        String channelTitle = youtube.getChannelTitle();

        // Construct the prompt
        return String.format("Generate a SNS post about [%s] featuring the video [%s]. Don't forget to mention the official link [%s] and the description [%s]. Use randomly mixed expressions and casual slang to make it sound natural. Include hashtags #[%s] #[%s]. Mention the channel title [%s]. Avoid overusing the interjection. And do not use [OMG],[whoa]",
                category, title, url, description, topicCategory, category, channelTitle);
    }

    public String getYoutubePrompt(Long id) {
        Youtube youtube = youtubeRepository.getYoutubeById(id);

        return youtube.getPrompt();
    }
}
