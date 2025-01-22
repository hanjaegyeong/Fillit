package com.social.a406.domain.chat.entity;

import com.social.a406.domain.user.entity.User;
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
    @JoinColumn(name = "user_id")
    private User user;

    @MapsId("chatRoomId")
    @ManyToOne
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;

    @Column(name = "content")
    private String messageContent;

    @Column(name = "timestamp")
    private LocalDateTime createAt;

}
