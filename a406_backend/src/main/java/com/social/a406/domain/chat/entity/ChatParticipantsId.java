package com.social.a406.domain.chat.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class ChatParticipantsId implements Serializable {
    private Long userId;  // User 엔티티와 매핑되는 필드
    private Long chatRoomId;  // ChatRoom 엔티티와 매핑되는 필드
}
