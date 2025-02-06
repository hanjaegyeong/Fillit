package com.social.a406.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    private Long chatRoomId;
    private String otherUser; // 상대방 이름
    private String profileImageUrl;

    private String lastMessageContent;
    private LocalDateTime lastMessageTime;

    private Long unReadMessageCount;

}
