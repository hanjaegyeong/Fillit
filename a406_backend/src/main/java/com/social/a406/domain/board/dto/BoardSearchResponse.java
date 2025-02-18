package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
public class BoardSearchResponse {
    private LocalDateTime cursorId;
    private List<BoardRecommendResponse> responses;
}
