package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatParticipants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatParticipantsRepository  extends JpaRepository<ChatParticipants, Long> {

    Optional<ChatParticipants> findByChatRoomIdAndUserId (Long chatRoomId, String userId) ;

    List<ChatParticipants> findByUserId(String userId);


    @Query("SELECT cp FROM ChatParticipants cp WHERE cp.chatRoom.id = :chatRoomId AND cp.user.id != :userId")
    Optional<ChatParticipants> findOtherParticipantByChatRoomIdAndUserId(@Param("chatRoomId") Long chatRoomId, @Param("userId") String userId);

}
