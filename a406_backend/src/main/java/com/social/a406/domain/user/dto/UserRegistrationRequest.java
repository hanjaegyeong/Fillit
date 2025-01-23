package com.social.a406.domain.user.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

// 일반 유저 회원가입
@Data
@EqualsAndHashCode(callSuper = true)
public class UserRegistrationRequest extends RegistrationRequest {
    private String email;
    private String password;
}