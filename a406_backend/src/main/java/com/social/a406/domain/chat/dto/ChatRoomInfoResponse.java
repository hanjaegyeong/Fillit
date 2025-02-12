package com.social.a406.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomInfoResponse {
    private Long chatRoomId;
    private String personalId; // 내 @personalId

    private String otherPersonalId; // 상대 @personalId
    private String otherUserName; // 상대방 이름

    private String otherProfileImageUrl;
}
