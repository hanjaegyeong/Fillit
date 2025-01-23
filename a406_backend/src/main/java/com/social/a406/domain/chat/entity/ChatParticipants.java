package com.social.a406.domain.chat.entity;

import com.social.a406.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_participants",
        indexes = @Index(name = "idx_chat_room_user", columnList = "chat_room_id, user_id") // snake_case 사용
)
public class ChatParticipants {

    @EmbeddedId
    private ChatParticipantsId chatParticipantsId;

    @ManyToOne
    @MapsId("chatRoomId")
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Long lastReadMessageId;

    @Builder
    public ChatParticipants(ChatRoom chatRoom, User user, Long lastReadMessageId) {
        this.chatRoom = chatRoom;
        this.user = user;
        this.chatParticipantsId = new ChatParticipantsId(chatRoom.getChatRoomId(), user.getId()); // 복합 키 생성
        this.lastReadMessageId = lastReadMessageId;
    }

    // 복합키 필드 접근 메서드
    public Long getChatRoomId() {
        return chatParticipantsId.getChatRoomId();
    }

    public String getUserId() {
        return chatParticipantsId.getUserId();
    }

}

