package com.social.a406.domain.chat.dto;

import com.social.a406.domain.chat.entity.ChatMessage;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private List<ChatMessage> messages;
    private Long nextCursor;
}
