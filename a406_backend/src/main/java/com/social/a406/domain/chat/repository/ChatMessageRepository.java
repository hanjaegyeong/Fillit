package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    //채팅방ID로 채팅메세지 전부 가져오는 메서드
    List<ChatMessage> findByChatMessageId_ChatRoomIdOrderByChatMessageId_MessageIdDesc(Long chatRoomId);

    // 채팅방 ID를 기반으로 가장 최근 메시지의 ID를 찾는 메서드
    @Query("SELECT MAX(cm.chatMessageId.messageId) " +
            "FROM ChatMessage cm " +
            "WHERE cm.chatMessageId.chatRoomId = :chatRoomId")
    Optional<Long> findLastMessageIdByChatMessageId_ChatRoomId(@Param("chatRoomId") Long chatRoomId);

    // 안읽은 메세지 개수 세기
    @Query("SELECT COUNT(cm) " +
            "FROM ChatMessage cm " +
            "WHERE cm.chatMessageId.chatRoomId = :chatRoomId " +
            "AND cm.chatMessageId.messageId > :lastReadMessageId " +
            "AND cm.chatParticipants.chatParticipantsId.userId <> :userId")
    Long countUnreadMessagesExcludeUser(@Param("chatRoomId") Long chatRoomId,
                                        @Param("lastReadMessageId") Long lastReadMessageId,
                                        @Param("userId") String userId);

    // 채팅방내 자신을 제외한 가장 최근 메세지 Id 찾기
    @Query("SELECT MAX(cm.chatMessageId.messageId) " +
            "FROM ChatMessage cm " +
            "WHERE cm.chatMessageId.chatRoomId = :chatRoomId " +
            "AND cm.chatParticipants.chatParticipantsId.userId <> :userId")
    Long findLastMessageIdByChatMessageId_ChatRoomIdAndNotUserId(@Param("chatRoomId") Long chatRoomId,
                                                                 @Param("userId") String userId);

}
