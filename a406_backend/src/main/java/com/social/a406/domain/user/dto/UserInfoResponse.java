package com.social.a406.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class UserInfoResponse {
    private String personalId;
    private String name;
    private String profileImageUrl;
}
