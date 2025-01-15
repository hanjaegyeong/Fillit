package com.social.a406.domain.user.dto;

import lombok.Data;

@Data
public class SocialLoginRequest {
    private String socialDomain; // 소셜 플랫폼 (Google, Kakao 등)
    private String socialId;     // 소셜 로그인 ID
}
