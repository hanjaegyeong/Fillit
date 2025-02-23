package com.social.a406.domain.oauth.dto;

public record OauthResponse(
        String socialDomain,
        String socialId
) {
    public static OauthResponse of(String socialId, String socialDomain) {
        return new OauthResponse(socialId, socialDomain);
    }
}
