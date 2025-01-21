package com.social.a406.domain.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class SubredditDTO {
    private Long id;
    private String name;
    private String content;
}
