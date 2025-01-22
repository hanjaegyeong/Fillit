package com.social.a406.domain.like.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikedUserResponse {
    private String personalId;        // personalId
    private String profileImageUrl; // 프로필 이미지 URL
}
