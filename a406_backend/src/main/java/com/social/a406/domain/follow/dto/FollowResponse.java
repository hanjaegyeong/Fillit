package com.social.a406.domain.follow.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FollowResponse {
    private String personalId;
    private String name;
    private String profileImageUrl;
    private boolean isFollow;
}
