package com.social.a406.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserCharacterResponse {
    private String type; // "user" 또는 "ai"
    private String id; // 유저 ID 또는 캐릭터
    private String name;
    private String personalId;
    private String profileImageUrl;
    private String introduction;
    private String birthDate; // 생년월일 (yyyy-MM-dd)
    private Long followerCount;
    private Long followeeCount;
    private boolean isFollow;
}
