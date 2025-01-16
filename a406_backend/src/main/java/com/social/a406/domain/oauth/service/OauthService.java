package com.social.a406.domain.oauth.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.oauth.dto.OauthToken;
import com.social.a406.domain.oauth.dto.OauthUserInfo;
import com.social.a406.domain.user.dto.SocialLoginRequest;
import com.social.a406.domain.user.service.CustomUserDetailsService;
import com.social.a406.util.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;


@Service
@Slf4j
public class OauthService {

    private final RestTemplate restTemplate;
    CustomUserDetailsService customUserDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

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

    // google 환경 변수
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

    @Autowired
    public OauthService(RestTemplate restTemplate, CustomUserDetailsService customUserDetailsService, JwtTokenUtil jwtTokenUtil) {
        this.restTemplate = restTemplate;
        this.jwtTokenUtil = jwtTokenUtil;
        this.customUserDetailsService = customUserDetailsService;
    }


    public Map<String, String> socialLogin(SocialLoginRequest socialLoginRequest) {
        UserDetails userDetails = customUserDetailsService.loadSocialUserBySocialId(socialLoginRequest.getSocialId());

        // 사용자 검증
        if (userDetails == null) {
            log.warn("Login failed. User not found with social ID: {}", socialLoginRequest.getSocialId());
            throw new RuntimeException("Social ID does not exist");
        }

        // JWT 토큰 생성
        String accessToken = jwtTokenUtil.generateToken(userDetails);
        String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);

        // AccessToken과 RefreshToken을 Map으로 반환
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens;
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

            String socialId = jsonNode.get("sub").asText();
            String socialDomain = "GOOGLE";
            OauthUserInfo googleUserInfo = new OauthUserInfo(socialId, socialDomain);
            return googleUserInfo;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("fail to get google user info");
        }
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
    }
}
