package com.social.a406.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageListResponse {
    private List<ChatMessageDto> messages;
    private Long nextCursor;
    private boolean hasNext;
}
