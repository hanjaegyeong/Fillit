package com.social.a406.domain.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;


@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class) //날짜 자동 업데이트를 위한 애노테이션
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_participants_id", nullable = false)
    private ChatParticipants chatParticipants;

    @Column(nullable = false, length = 1000)
    private String messageContent;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public ChatMessage(ChatParticipants chatParticipants, String messageContent) {
        this.chatParticipants = chatParticipants;
        this.messageContent = messageContent;
    }
}
