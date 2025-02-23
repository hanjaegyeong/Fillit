package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
public class BoardRecommendCursorResponse {
    private LocalDateTime cursorId;
    private Long cursorLikeCount;
    private Long interestId;
    private List<BoardRecommendResponse> responses;
}
