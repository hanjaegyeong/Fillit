package com.social.a406.domain.chat.entity;

import com.social.a406.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "chat_participants")
public class ChatParticipants {

    @EmbeddedId
    private ChatParticipantsId chatParticipantsId;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("chatRoomId")
    @JoinColumn(name = "chat_room_id" )
    private ChatRoom chatRoom;

    private Long lastReadMessageId;

    // 복합키 필드 접근 메서드
    public Long getChatRoomId() {
        return chatParticipantsId.getChatRoomId();
    }

    public Long getUserId() {
        return chatParticipantsId.getUserId();
    }

}

