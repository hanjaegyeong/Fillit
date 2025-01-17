package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardRequest {
    private String content;
}
