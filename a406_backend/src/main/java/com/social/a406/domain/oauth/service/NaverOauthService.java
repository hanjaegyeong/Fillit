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
public class NaverOauthService {

    private final RestTemplate restTemplate;

    // naver 환경 변수
    @Value("${oauth.naver.access_token_api}")
    private String naverAccessTokenApi;
    @Value("${oauth.naver.get_userinfo_api}")
    private String naverUserInfoApi;
    @Value("${oauth.naver.redirect_uri}")
    private String naverRedirectUri;
    @Value("${oauth.google.client_id}")
    private String naverClientId;
    @Value("${oauth.naver.client_secret}")
    private String naverClientSecret;

    public NaverOauthService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // 프론트 개발 후 사용
    public OauthToken getNaverToken(String code) {
        String url = naverAccessTokenApi;

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id",naverClientId)
                .queryParam("redirect_uri",naverRedirectUri)
                .queryParam("code", code);

        builder.queryParam("client_secret", naverClientSecret);

        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(builder.toUriString(), HttpMethod.POST, entity, String.class);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            final String accessToken = jsonNode.get("access_token").asText();
            final String refreshToken = jsonNode.get("refresh_token").asText();
            OauthToken naverToken = new OauthToken(accessToken, refreshToken);
            return naverToken;
        }catch (JsonProcessingException e){
            throw new RuntimeException("fail to get naver token");
        }
    }

    public OauthUserInfo getNaverInfo(String accessToken) {
        String url = naverUserInfoApi;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            String socialId = jsonNode.get("response").get("id").asText();
            String socialDomain = "NAVER";
            OauthUserInfo naverUserInfo = new OauthUserInfo(socialId, socialDomain);
            return naverUserInfo;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("fail to get naver user info");
        }
    }}
