package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatParticipants;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatParticipantsRepository extends JpaRepository<ChatParticipants, Long> {

//    List<ChatParticipants> findByUserId(String userId);

    Optional<ChatParticipants> findByChatParticipantsId_ChatRoomIdAndChatParticipantsId_UserId(Long chatRoomId, String userId);

    Optional<ChatParticipants> findByChatParticipantsId_UserIdAndChatParticipantsId_ChatRoomId(String userId, Long chatRoomId);

//    List<ChatParticipants> findByChatParticipantsId_UserId(String userId);
//
//    Optional<ChatParticipants> findOtherParticipantByChatParticipantsId_ChatRoomIdAndChatParticipantsId_UserId(Long chatRoomId, String userId);
}
