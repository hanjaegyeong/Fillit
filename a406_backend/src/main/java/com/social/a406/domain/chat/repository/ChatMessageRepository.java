package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    //채팅방ID로 채팅메세지 전부 가져오는 메서드
    @Query("""
    SELECT c FROM ChatMessage c
    JOIN FETCH c.chatParticipants p
    JOIN FETCH p.chatRoom r
    WHERE r.id = :chatRoomId
    AND c.id < :cursor
    """)
    Slice<ChatMessage> findMessagesByCursor(
            @Param("chatRoomId") Long chatRoomId,
            @Param("cursor") Long cursor,
            Pageable pageable);

    // 안읽은 메세지 개수 세기

//    @Query("SELECT COUNT(cm) " +
//            "FROM ChatMessage cm " +
//            "WHERE cm.chatMessageId.chatRoomId = :chatRoomId " +
//            "AND cm.chatMessageId.messageId > :lastReadMessageId " +
//            "AND cm.chatParticipants.chatParticipantsId.userId <> :userId")
//    Long countUnreadMessagesExcludeUser(@Param("chatRoomId") Long chatRoomId,
//                                        @Param("lastReadMessageId") Long lastReadMessageId,
//                                        @Param("userId") String userId);
//
//    // 채팅방내 자신을 제외한 가장 최근 메세지 Id 찾기
//    @Query("SELECT MAX(cm.chatMessageId.messageId) " +
//            "FROM ChatMessage cm " +
//            "WHERE cm.chatMessageId.chatRoomId = :chatRoomId " +
//            "AND cm.chatParticipants.chatParticipantsId.userId <> :userId")
//    Long findLastMessageIdByChatMessageId_ChatRoomIdAndNotUserId(@Param("chatRoomId") Long chatRoomId,
//                                                                 @Param("userId") String userId);

}
