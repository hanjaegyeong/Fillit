package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BoardRecommendResponse {
    private Long boardId;
    private String personalId;
    private String profileImageUrl;
    private String content;
    private Long likeCount;
    private Long commentCount;
    private String keyword;
    private String imageUrl;
    private Boolean isLiked;
    private LocalDateTime createdAt;
}
