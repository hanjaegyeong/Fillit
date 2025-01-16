package com.social.a406.domain.like.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikedUserResponse {
    private String loginId;         // 로그인 ID
    private String nickname;        // 닉네임
    private String profileImageUrl; // 프로필 이미지 URL
}
