package com.social.a406.domain.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class UserSearchResponse {
    private String cursorId;
    private List<UserInfoResponse> responses;
}
