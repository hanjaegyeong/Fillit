package com.social.a406.domain.chat.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class ChatParticipantsId implements Serializable {
    private Long chatRoomId;  // ChatRoom 엔티티와 매핑되는 필드
    private String userId;  // User 엔티티와 매핑되는 필드
}
