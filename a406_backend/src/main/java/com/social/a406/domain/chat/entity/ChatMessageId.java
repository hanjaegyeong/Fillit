package com.social.a406.domain.chat.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class ChatMessageId implements Serializable {
    private Long messageId;
    private Long chatRoomId;

    public ChatMessageId(Long chatRoomId, Long nextMessageId) {
    }
}