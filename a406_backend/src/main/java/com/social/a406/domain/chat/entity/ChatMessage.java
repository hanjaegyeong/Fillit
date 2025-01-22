package com.social.a406.domain.chat.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "chat_message")
@EntityListeners(AuditingEntityListener.class) //날짜 자동 업데이트를 위한 애노테이션
public class ChatMessage {

    @EmbeddedId
    private ChatMessageId chatMessageId;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "chat_room_id", referencedColumnName = "chatRoomId"), // 복합키 필드 참조
            @JoinColumn(name = "user_id", referencedColumnName = "userId")            // ChatParticipants의 복합키 필드
    })
    private ChatParticipants chatParticipants;

    @Column(name = "content")
    private String messageContent;

    @Column(name = "timestamp")
    private LocalDateTime createAt;

}
