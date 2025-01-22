package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository <ChatRoom, Long> {
    Optional<ChatRoom> findByChatRoomId(Long chatRoomId);

    @Query("SELECT 1")
    Optional<ChatRoom> findChatRoomByParticipants(@Param("userId1") String userId1, @Param("userId2") String userId2);

}
