package com.social.a406.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class UserSearchResponse {
    private String personalId;
    private String name;
    private String profileImageUrl;

    public UserSearchResponse(String personalId, String name, String profileImageUrl){
        this.personalId = personalId;
        this.name = name;
        this.profileImageUrl = profileImageUrl;
    }
}
