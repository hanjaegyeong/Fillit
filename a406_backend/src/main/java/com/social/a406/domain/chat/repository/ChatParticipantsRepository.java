package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatParticipants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatParticipantsRepository  extends JpaRepository<ChatParticipants, Long> {

    Optional<ChatParticipants> findByChatRoom_ChatRoomIdAndUserId(Long chatRoomId, String userId) ;

    List<ChatParticipants> findByUserId(String userId);

    @Query("SELECT 1")
    Optional<ChatParticipants> findOtherParticipantByChatRoom_ChatRoomIdAndUserId(@Param("chatRoomId") Long chatRoomId, @Param("userId") String userId);

}
