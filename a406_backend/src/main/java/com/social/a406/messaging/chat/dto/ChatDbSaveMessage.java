package com.social.a406.messaging.chat.dto;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class ChatDbSaveMessage {
    private final String personalId;
    private final ChatMessageRequest chatMessageRequest;

}
