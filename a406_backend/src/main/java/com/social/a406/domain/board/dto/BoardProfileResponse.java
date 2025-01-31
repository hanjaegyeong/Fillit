package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoardProfileResponse {
    private Long BoardId;
    private Double x;
    private Double y;
    private Double z;
    private String keyword;
    private Integer pageNumber;
    private String imageUrl;
}
