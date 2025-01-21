package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository <ChatRoom, Long> {
    Optional<ChatRoom> findByChatRoomId(Long chatRoomId);

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.participants cp1 JOIN cr.participants cp2 " +
            "WHERE cp1.user.id = :userId1 AND cp2.user.id = :userId2")
    Optional<ChatRoom> findChatRoomByParticipants(@Param("userId1") String userId1, @Param("userId2") String userId2);

}
