package com.social.a406.messaging.chat.dto;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomUpdateMessage {
    private String personalId;
    private List<String> otherPersonalIds;
    private ChatMessageRequest chatMessageRequest;
}
