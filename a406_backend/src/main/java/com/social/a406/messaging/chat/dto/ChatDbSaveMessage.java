package com.social.a406.messaging.chat.dto;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatDbSaveMessage {
    private String personalId;
    private ChatMessageRequest chatMessageRequest;

}
