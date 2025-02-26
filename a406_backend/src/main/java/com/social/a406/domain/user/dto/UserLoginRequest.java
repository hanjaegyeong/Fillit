package com.social.a406.domain.user.dto;

import lombok.Data;

// 일반 유저 로그인
@Data
public class UserLoginRequest {
    private String emailOrPersonalId;   // 이메일 또는 퍼스널ID
    private String password;  // 로그인 비밀번호
}
