package com.social.a406.domain.feed.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostDto {
    private Long boardId;
    private String content;
    private String personalId;
    private String profileImageUrl;

    private Long likeCount;
    private Long commentCount;
    private String keyword;
    private String imageUrl;
    private LocalDateTime createdAt;
    private Boolean isRecommended;
}
