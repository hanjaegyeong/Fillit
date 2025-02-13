package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardRecommendResponse {
    private Long boardId;
    private String personalId;
    private String profileImageUrl;
    private Long likeCount;
    private Long commentCount;
    private String keyword;
    private String imageUrl;
    private Long interestId;
    private Boolean isLiked;
}
