package com.social.a406.domain.chat.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatRoomResponse {
    private Long chatRoomId;
    private String lastMessageContent;
    private LocalDateTime lastMessageTime;

    private String otherUser;// 상대방 이름
    private Integer unReadMessageCount;
}
