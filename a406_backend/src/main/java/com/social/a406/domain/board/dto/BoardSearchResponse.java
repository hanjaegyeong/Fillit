package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class BoardSearchResponse {
    private Long cursorId;
    private List<BoardRecommendResponse> responses;
}
