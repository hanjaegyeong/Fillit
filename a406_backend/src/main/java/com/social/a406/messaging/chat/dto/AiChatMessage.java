package com.social.a406.messaging.chat.dto;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AiChatMessage {
    private User aiUser;
    private String otherUserName;
    private ChatMessageRequest chatMessageRequest;
}
