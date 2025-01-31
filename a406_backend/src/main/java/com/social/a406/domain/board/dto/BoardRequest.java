package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BoardRequest {
    private String content;
    
    private Double x;
    private Double y;
    private Integer z = 0;
    private String keyword;
    private Integer pageNumber;
    private List<String> interests;
}
