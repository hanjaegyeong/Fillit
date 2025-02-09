package com.social.a406.domain.oauth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OauthLoginResponse {
    private String personalId;
    private String accessToken;
}
