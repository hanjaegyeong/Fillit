package com.social.a406.domain.user.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SocialUserRegistrationRequest extends RegistrationRequest {
    private String socialDomain; // e.g., GOOGLE, KAKAO 등
    private String socialId;     // 소셜 로그인 ID
}