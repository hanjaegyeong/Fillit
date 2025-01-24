package com.social.a406.domain.chatBot.dto;

import lombok.Getter;

@Getter
public class AiChatResponse {
    private final String message;

    public AiChatResponse(String message){
        this.message = message;
    }
}
