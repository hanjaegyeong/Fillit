package com.social.a406.domain.user.dto;

import lombok.Data;

// 일반 유저 로그인
@Data
public class UserLoginRequest {
    private String email;   // 이메일
    private String password;  // 로그인 비밀번호
}
