package com.social.a406.domain.oauth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.oauth.dto.OauthToken;
import com.social.a406.domain.oauth.dto.OauthUserInfo;
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
public class GoogleOauthService {

    private final RestTemplate restTemplate;

    // google 환경 변수
    @Value("${oauth.google.access_token_api}")
    private String googleAccessTokenApi;
    @Value("${oauth.google.get_userinfo_api}")
    private String googleUserInfoApi;
    @Value("${oauth.google.redirect_uri}")
    private String googleRedirectUri;
    @Value("${oauth.google.client_id}")
    private String googleClientId;
    @Value("${oauth.google.client_secret}")
    private String googleClientSecret;
    @Value("${oauth.google.scope")
    private String googleScope;

    public GoogleOauthService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // 프론트 개발 후 사용
    public OauthToken getGoogleToken(String code) {
        String url = googleAccessTokenApi;

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id",googleClientId)
                .queryParam("redirect_uri",googleRedirectUri)
                .queryParam("code", code)
                .queryParam("scope",googleScope);

        builder.queryParam("client_secret", googleClientSecret);

        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.POST, entity, String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            final String accessToken = jsonNode.get("access_token").asText();
            final String refreshToken = jsonNode.get("refresh_token").asText();
            OauthToken googleToken = new OauthToken(accessToken, refreshToken);
            return googleToken;
        }catch (JsonProcessingException e){
            throw new RuntimeException("fail to get google token");
        }
    }

    public OauthUserInfo getGoogleInfo(String accessToken) {
        String url = googleUserInfoApi;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            String socialId = jsonNode.get("id").asText();
            String socialDomain = "GOOGLE";
            OauthUserInfo googleUserInfo = new OauthUserInfo(socialId, socialDomain);
            return googleUserInfo;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("fail to get google user info");
        }
    }
}
