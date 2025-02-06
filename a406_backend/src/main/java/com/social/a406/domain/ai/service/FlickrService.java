package com.social.a406.domain.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.ArrayList;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlickrService {

    private static final String API_URL = "https://api.flickr.com/services/rest/"
            + "?method=flickr.photos.search&api_key=%s&text=%s"
            + "&format=json&nojsoncallback=1";

    @Value("${FLICKR_API_KEY}")
    private String flickrApiKey;

    private final RestTemplate restTemplate;
    private final Random random = new Random();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 주어진 키워드로 Flickr API에서 이미지를 검색하고, 랜덤한 이미지의 URL을 반환
     */
    public String getRandomImageUrl(String keyword) {
        List<String> imageUrls = fetchImageUrls(keyword);
        if (imageUrls.isEmpty()) {
            log.warn("No images found for keyword: {}", keyword);
            return null;
        }
        return imageUrls.get(random.nextInt(imageUrls.size()));
    }

    /**
     * Flickr API에서 주어진 키워드로 이미지 URL 리스트를 가져옴
     */
    private List<String> fetchImageUrls(String keyword) {
        List<String> imageUrls = new ArrayList<>();
        try {
            String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);
            String requestUrl = String.format(API_URL, flickrApiKey, encodedKeyword);

            log.debug("Requesting Flickr API: {}", requestUrl);

            String jsonResponse = restTemplate.getForObject(requestUrl, String.class);
            if (jsonResponse == null) {
                log.warn("Empty response from Flickr API.");
                return imageUrls;
            }

            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode photosArray = rootNode.path("photos").path("photo");

            for (JsonNode photo : photosArray) {
                String imageUrl = generateImageUrl(photo);
                if (imageUrl != null) {
                    imageUrls.add(imageUrl);
                }
            }

            log.debug("Total images fetched: {}", imageUrls.size());
        } catch (Exception e) {
            log.error("Error fetching images from Flickr API: {}", e.getMessage());
        }
        return imageUrls;
    }

    /**
     * Flickr API 응답에서 개별 이미지 정보를 추출하여 URL을 생성
     */
    private String generateImageUrl(JsonNode photo) {
        try {
            int farm = photo.get("farm").asInt();
            String server = photo.get("server").asText();
            String id = photo.get("id").asText();
            String secret = photo.get("secret").asText();
            return String.format("https://farm%d.staticflickr.com/%s/%s_%s.jpg", farm, server, id, secret);
        } catch (Exception e) {
            log.error("Error generating image URL: {}", e.getMessage());
            return null;
        }
    }
}
