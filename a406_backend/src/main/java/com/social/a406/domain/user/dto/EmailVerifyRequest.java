package com.social.a406.domain.user.dto;

import lombok.Getter;

@Getter
public class EmailVerifyRequest {
    String email;
    String code;
}
