package com.social.a406.domain.chat.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatRoomResponse {
    private Long chatRoomId;
    private String lastMessageContent;
    private LocalDateTime lastMessageTime;

    private String otherUser;// 상대방 이름
    private Integer unReadMessageCount;

    @Builder
    public ChatRoomResponse(Long chatRoomId, String lastMessageContent, LocalDateTime lastMessageTime, String otherUser, int unReadMessageCount) {
        this.chatRoomId = chatRoomId;
        this.lastMessageContent = lastMessageContent;
        this.lastMessageTime = lastMessageTime;
        this.otherUser = otherUser;
        this.unReadMessageCount = unReadMessageCount;
    }
}
