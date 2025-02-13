package com.social.a406.domain.chat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lastMessageContent;

    @LastModifiedDate
    private LocalDateTime lastMessageTime;

    // 채팅 참여자 목록 (양방향 연관관계로 관리하거나 단방향으로만 사용)
    @OneToMany(mappedBy = "chatRoom", fetch = FetchType.LAZY)
    private List<ChatParticipants> participants = new ArrayList<>();


    public void updateLastMessageContent(String newContent) {
        this.lastMessageContent = newContent;
    }

    @Builder
    public ChatRoom (String lastMessageContent) {
        this.lastMessageContent = lastMessageContent;
    }


}
