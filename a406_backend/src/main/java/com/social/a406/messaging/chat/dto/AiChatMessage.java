package com.social.a406.messaging.chat.dto;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AiChatMessage {
    private String aiPersonalId;
    private String mainPrompt;
    private String otherUserName;
    private ChatMessageRequest chatMessageRequest;
}
