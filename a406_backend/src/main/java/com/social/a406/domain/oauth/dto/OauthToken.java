package com.social.a406.domain.oauth.dto;

public record OauthToken(
        String accessToken,
        String refreshToken
) {
    public static OauthToken of(String accessToken, String refreshToken) {
        return new OauthToken(accessToken, refreshToken);
    }
}
