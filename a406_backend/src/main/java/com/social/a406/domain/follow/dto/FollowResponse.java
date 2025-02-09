package com.social.a406.domain.follow.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FollowResponse {
    private String personalId;
    private String profileImageUrl;
    private boolean isFollow;
}
