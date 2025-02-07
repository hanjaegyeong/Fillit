package com.social.a406.domain.chat.repository;

import com.social.a406.domain.chat.entity.ChatParticipants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ChatParticipantsRepository extends JpaRepository<ChatParticipants, Long> {

    Optional<ChatParticipants> findByChatRoom_IdAndUser_Id(Long chatRoomId, String userId);

    /**
     * (1) userId로 해당 유저가 속한 ChatParticipants를 모두 가져오는데
     *     ChatRoom까지 JOIN FETCH로 한 번에 조회해온다.
     *
     *  - "JOIN FETCH cp.chatRoom" 덕분에 Lazy Loading 없이
     *    ChatRoom 정보를 같은 쿼리로 가져와서 N+1 문제를 방지.
     */
    @Query("""
        SELECT cp
        FROM ChatParticipants cp
        JOIN FETCH cp.chatRoom cr
        WHERE cp.user.id = :userId
        ORDER BY cr.lastMessageTime DESC
        """)
    List<ChatParticipants> findByUserIdWithChatRoomFetch(@Param("userId") String userId);

    /**
     * (2) 여러 chatRoomIds에 대해서, 해당 Room에 참여 중인 ChatParticipants를 한 번에 조회
     *     이때 User까지 JOIN FETCH하면 "cp.user"의 Lazy Loading도 방지 가능.
     *
     *  - "cp.chatRoom.id IN :roomIds"로 한 번에 조건을 주어, 반복적으로 쿼리를 내는 것을 피한다.
     */
    @Query("""
    SELECT cp
    FROM ChatParticipants cp
    JOIN FETCH cp.user u
    WHERE cp.chatRoom.id IN :chatRoomIds
      AND cp.user.id <> :userId
    """)
    List<ChatParticipants> findAllByChatRoomIdInAndNotUserId(
            @Param("chatRoomIds") Set<Long> chatRoomIds,
            @Param("userId") String userId
    );


    @Query("""
    SELECT cp FROM ChatParticipants cp
    WHERE cp.chatRoom.id = :chatRoomId
    AND cp.user.id NOT IN :userIdList
    """)
    List<ChatParticipants> findByChatRoomIdAndUserIdNotIn(
            @Param("chatRoomId") Long chatRoomId,
            @Param("userIdList") List<String> userIdList
    );


}


