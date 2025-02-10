package com.social.a406.domain.chat.event;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AIChatMessageEvent {
    private User aiUser;
    private ChatMessageRequest chatMessageRequest;
}
