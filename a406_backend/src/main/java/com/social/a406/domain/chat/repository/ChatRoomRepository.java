package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository <ChatRoom, Long> {

    @Query("""
    SELECT cr
    FROM ChatRoom cr
    JOIN ChatParticipants cp1 ON cp1.chatRoom.id = cr.id
    JOIN ChatParticipants cp2 ON cp2.chatRoom.id = cr.id
    WHERE cp1.user.id = :userId AND cp2.user.id = :otherId
    """)
    Optional<ChatRoom> findChatRoomByParticipants(
            @Param("userId") String userId,
            @Param("otherId") String otherId
    );

}