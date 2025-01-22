package com.social.a406.domain.chat.repository;
import com.social.a406.domain.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoom_ChatRoomId(Long chatRoomId); // 특정 채팅방의 모든 메시지 조회

    // 채팅방 ID를 기반으로 가장 최근 메시지의 ID를 찾는 메서드
    @Query("SELECT 1")
    Long findLastMessageIdByChatRoom_ChatRoomId(@Param("chatRoomId") Long chatRoomId);

    //
    @Query("SELECT 1")
    Long countByChatRoomIdAndMessageIdGreaterThanExcludeUser(@Param("chatRoomId") Long chatRoomId, @Param("lastReadMessageId") Long lastReadMessageId, @Param("userId") String userId);

    @Query("SELECT 1")
    Long findLastMessageIdByChatRoomIdAndNotUserId(@Param("chatRoomId") Long chatRoomId, @Param("userId") String userId);
}
