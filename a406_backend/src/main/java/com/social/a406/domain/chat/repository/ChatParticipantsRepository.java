package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatParticipants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatParticipantsRepository extends JpaRepository<ChatParticipants, Long> {

    Optional<ChatParticipants> findByChatParticipantsId_ChatRoomIdAndChatParticipantsId_UserId(Long chatRoomId, String userId);

    List<ChatParticipants> findByChatParticipantsId_UserId(String userId);

    // 내 ChatRoomId와 userId로 다른 사용자를 찾는 메서드
    @Query("SELECT cp FROM ChatParticipants cp " +
            "WHERE cp.chatParticipantsId.chatRoomId = :chatRoomId " +
            "AND cp.chatParticipantsId.userId != :userId")
    Optional<ChatParticipants> findOtherParticipantByChatParticipantsId_ChatRoomIdAndChatParticipantsId_UserId(
            @Param("chatRoomId") Long chatRoomId,
            @Param("userId") String userId);}
