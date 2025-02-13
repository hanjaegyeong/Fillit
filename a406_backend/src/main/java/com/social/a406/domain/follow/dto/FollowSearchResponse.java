package com.social.a406.domain.follow.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FollowSearchResponse {
    private String personalId;
    private String name;
    private String profileImageUrl;
    private Boolean isFollow;
}
