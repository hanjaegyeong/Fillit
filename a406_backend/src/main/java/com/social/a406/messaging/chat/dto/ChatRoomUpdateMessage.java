package com.social.a406.messaging.chat.dto;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class ChatRoomUpdateMessage {
    private final String personalId;
    private final List<String> otherPersonalIds;
    private final ChatMessageRequest chatMessageRequest;
}
