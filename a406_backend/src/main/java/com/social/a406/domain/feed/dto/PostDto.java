package com.social.a406.domain.feed.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class PostDto {
    private Long boardId;
    private Long userId;
    private String content;
    private Integer likeCount;
    private LocalDateTime createdAt;
    private Boolean isRecommended;

    // getters and setters
}