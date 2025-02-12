package com.social.a406.domain.oauth.service;

import com.social.a406.domain.user.dto.SocialLoginRequest;
import com.social.a406.domain.user.service.CustomUserDetailsService;
import com.social.a406.util.JwtTokenUtil;
import com.social.a406.util.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
@Slf4j
@RequiredArgsConstructor
public class OauthService {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

    public Map<String, String> socialLogin(SocialLoginRequest socialLoginRequest) {
        UserDetails userDetails = customUserDetailsService.loadSocialUserBySocialId(socialLoginRequest.getSocialId());

        // 사용자 검증
        if (userDetails == null) {
            log.warn("Login failed. User not found with social ID: {}", socialLoginRequest.getSocialId());
            throw new ForbiddenException("Social ID does not exist");
        }

        // JWT 토큰 생성
        String accessToken = jwtTokenUtil.generateToken(userDetails);
        String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);

        // AccessToken과 RefreshToken을 Map으로 반환
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("personalId", userDetails.getUsername());

        return tokens;
    }
}
