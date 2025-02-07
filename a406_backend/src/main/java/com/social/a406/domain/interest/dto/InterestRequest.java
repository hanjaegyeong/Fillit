package com.social.a406.domain.interest.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class InterestRequest {
    String personalId;
    List<String> interestContents;
}
