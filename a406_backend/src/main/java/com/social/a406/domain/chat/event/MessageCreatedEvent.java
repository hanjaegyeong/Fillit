package com.social.a406.domain.chat.event;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MessageCreatedEvent {
    private String personalId;
    private ChatMessageRequest chatMessageRequest;
}
