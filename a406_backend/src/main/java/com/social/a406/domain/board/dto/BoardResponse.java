package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BoardResponse {
    private Long boardId;
    private String content;
    private String personalId;
    private Long likeCount;

    private Double x;
    private Double y;
    private String keyword;
    private Integer pageNumber;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
