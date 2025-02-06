package com.social.a406.domain.feed.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostDto {
    private Long boardId;
    private String userId;
    private String content;
    private Long likeCount;
    private LocalDateTime createdAt;
    private Boolean isRecommended;
}
