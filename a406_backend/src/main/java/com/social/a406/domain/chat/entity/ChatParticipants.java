package com.social.a406.domain.chat.entity;

import com.social.a406.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class ChatParticipants {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Long unreadMessageCount = 0L;

    @Builder
    public ChatParticipants(ChatRoom chatRoom, User user) {
        this.chatRoom = chatRoom;
        this.user = user;
    }

    public void increaseUnreadMessageCount () {
        this.unreadMessageCount ++;
    }

    public void resetUnreadMessageCount () {
        this.unreadMessageCount = 0L;
    }

}

