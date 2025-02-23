package com.social.a406.domain.interest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InterestResponse {
    private Long interestId;
    private String content;
}
