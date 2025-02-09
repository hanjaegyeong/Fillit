package com.social.a406.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class UserLoginResponse {
    private String personalId;
    private String accessToken;
}
