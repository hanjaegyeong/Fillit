package com.social.a406.domain.ai.dto;

import lombok.Getter;

@Getter
public class AiChatResponse {
    private String message;

    public AiChatResponse(String message){
        this.message = message;
    }
}
