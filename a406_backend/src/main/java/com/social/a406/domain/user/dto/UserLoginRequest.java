package com.social.a406.domain.user.dto;

import lombok.Data;

@Data
public class UserLoginRequest {
    private String loginId;   // 일반 로그인 ID
    private String password;  // 일반 로그인 비밀번호
}
