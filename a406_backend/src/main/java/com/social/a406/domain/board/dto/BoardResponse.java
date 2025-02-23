package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BoardResponse {
    private Long boardId;
    private String content;
    private String personalId;
    private String profileImageUrl;
    private Long likeCount;
    private Long commentCount;

    private Double x;
    private Double y;
    private Double z;
    private String keyword;
    private Integer pageNumber;

    private List<String> imageUrls;
    private List<String> interests;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Boolean isLiked;
}
