package com.social.a406.domain.chat.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Embeddable
public class ChatMessageId implements Serializable {
    @Column(name = "message_id", nullable = false)
    private Long messageId;
    @Column(name = "chat_room_id", nullable = false)
    private Long chatRoomId;

}