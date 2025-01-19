package com.social.a406.domain.oauth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.oauth.dto.OauthToken;
import com.social.a406.domain.oauth.dto.OauthUserInfo;
import com.social.a406.domain.user.service.CustomUserDetailsService;
import com.social.a406.util.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@Slf4j
public class KakaoOauthService {
    private final RestTemplate restTemplate;

    // kakao 환경 변수
    @Value("${oauth.kakao.access_token_api}")
    private String kakaoAccessTokenApi;
    @Value("${oauth.kakao.get_userinfo_api}")
    private String kakaoUserInfoApi;
    @Value("${oauth.kakao.redirect_uri}")
    private String kakaoRedirectUri;
    @Value("${oauth.kakao.client_id}")
    private String kakaoClientId;
    @Value("${oauth.kakao.client_secret}")
    private String kakaoClientSecret;

    public KakaoOauthService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // 프론트 개발 후 사용
    public OauthToken getKakaoToken(String code) {
        String url = kakaoAccessTokenApi;

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id",kakaoClientId)
                .queryParam("redirect_uri",kakaoRedirectUri)
                .queryParam("code", code);

        builder.queryParam("client_secret", kakaoClientSecret);

        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.POST, entity, String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            final String accessToken = jsonNode.get("access_token").asText();
            final String refreshToken = jsonNode.get("refresh_token").asText();
            OauthToken kakaoToken = new OauthToken(accessToken, refreshToken);
            return kakaoToken;
        }catch (JsonProcessingException e){
            throw new RuntimeException("fail to get kakao token");
        }
    }

    public OauthUserInfo getKakaoInfo(String accessToken) {
        String url = kakaoUserInfoApi;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            String socialId = jsonNode.get("id").asText();
            String socialDomain = "KAKAO";
            OauthUserInfo kakaoUserInfo = new OauthUserInfo(socialId, socialDomain);
            return kakaoUserInfo;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("fail to get kakao user info");
        }
    }
}
