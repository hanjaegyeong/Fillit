package com.social.a406.domain.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_message",
    indexes = @Index(name = "idx_chat_room_message", columnList = "chat_room_id, message_id") // 복합 인덱스 생성

)
@EntityListeners(AuditingEntityListener.class) //날짜 자동 업데이트를 위한 애노테이션
public class ChatMessage {

    @EmbeddedId
    @AttributeOverrides({
            @AttributeOverride(name = "chatRoomId", column = @Column(name = "chat_room_id")),
            @AttributeOverride(name = "messageId", column = @Column(name = "message_id"))
    })
    private ChatMessageId chatMessageId;

//    @MapsId("chatRoomId")
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "chat_room_id", referencedColumnName = "chat_room_id", insertable = false, updatable = false), // 복합키 필드 참조
            @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    })
    private ChatParticipants chatParticipants;



//    @Column(name = "content")
    private String messageContent;

//    @Column(name = "create")
    @CreatedDate
    private LocalDateTime createAt;

    @Builder
    public ChatMessage(Long messageId, ChatParticipants chatParticipants, String messageContent) {
        this.chatParticipants = chatParticipants;
        this.messageContent = messageContent;
        this.chatMessageId = new ChatMessageId(messageId, chatParticipants.getChatRoomId());
    }
}
