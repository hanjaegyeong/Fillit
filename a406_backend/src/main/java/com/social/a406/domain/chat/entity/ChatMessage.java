package com.social.a406.domain.chat.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "chat_message")
@EntityListeners(AuditingEntityListener.class) //날짜 자동 업데이트를 위한 애노테이션
public class ChatMessage {

    @EmbeddedId
    private ChatMessageId chatMessageId;

    @MapsId("chatRoomId")
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "chatRoomId", referencedColumnName = "chatRoomId"), // 복합키 필드 참조
            @JoinColumn(name = "userId", referencedColumnName = "userId")            // ChatParticipants의 복합키 필드
    })
    private ChatParticipants chatParticipants;

    @Column(name = "content")
    private String messageContent;

    @CreatedDate
    @Column(name = "timestamp")
    private LocalDateTime createAt;

    @Builder
    public ChatMessage(Long messageId, ChatParticipants chatParticipants, String messageContent) {
        this.chatMessageId = new ChatMessageId(messageId, chatParticipants.getChatRoomId());
        this.chatParticipants = chatParticipants;
        this.messageContent = messageContent;
    }
}
