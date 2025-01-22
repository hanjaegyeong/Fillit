package com.social.a406.domain.chat.entity;

import com.social.a406.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "chat_participants")
public class ChatParticipants {

    @EmbeddedId
    private ChatParticipantsId chatParticipantsId;

    @ManyToOne
    @MapsId("chatRoomId")
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "userId")
    private User user;

    private Long lastReadMessageId;

    // 복합키 필드 접근 메서드
    public Long getChatRoomId() {
        return chatParticipantsId.getChatRoomId();
    }

    public Long getUserId() {
        return chatParticipantsId.getUserId();
    }

}

