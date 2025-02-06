package com.social.a406.domain.chat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    private String lastMessageContent;

    @LastModifiedDate
    private LocalDateTime lastMessageTime;


    public void updateLastMessageContent(String newContent) {
        this.lastMessageContent = newContent;
    }

    @Builder
    public ChatRoom (String lastMessageContent) {
        this.lastMessageContent = lastMessageContent;
    }
}
