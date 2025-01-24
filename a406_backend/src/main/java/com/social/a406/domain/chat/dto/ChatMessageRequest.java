package com.social.a406.domain.chat.dto;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private Long chatRoomId;  // 채팅방 ID
    private String messageContent;   // 메시지 내용
    private MessageType type; // 메시지 유형 (TEXT, ENTER, LEAVE 등)

    
    public enum MessageType {
        TEXT, ENTER, LEAVE
    }

    // Getters and Setters
}
