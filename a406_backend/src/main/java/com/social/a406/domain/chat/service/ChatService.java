package com.social.a406.domain.chat.service;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.dto.ChatMessageResponse;
import com.social.a406.domain.chat.dto.ChatRoomResponse;
import com.social.a406.domain.chat.entity.ChatMessage;
import com.social.a406.domain.chat.entity.ChatParticipants;
import com.social.a406.domain.chat.entity.ChatRoom;
import com.social.a406.domain.chat.repository.ChatMessageRepository;
import com.social.a406.domain.chat.repository.ChatParticipantsRepository;
import com.social.a406.domain.chat.repository.ChatRoomRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatParticipantsRepository chatParticipantsRepository;
    private final UserRepository userRepository;


    // 채팅 저장
    @Transactional
    public ChatMessage saveMessageAndUpdateRoom(String personalId, ChatMessageRequest request) {

        User user = findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with PersonalId: " + personalId));
        String userId = user.getId();

        Long chatRoomId = request.getChatRoomId();

        // 채팅참여 정보 가져오기
        ChatParticipants chatParticipants = chatParticipantsRepository.findByChatRoom_IdAndUser_Id(chatRoomId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with ID: " + chatRoomId + "," + userId));

        // 메시지 저장
        ChatMessage Message = ChatMessage.builder()
                .chatParticipants(chatParticipants)
                .messageContent(request.getMessageContent())
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(Message);

        // 채팅방 마지막 메시지 정보 업데이트
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found with ID: " + chatRoomId));
        chatRoom.updateLastMessageContent(savedMessage.getMessageContent());

        return savedMessage;
    }

    // 채팅방 입장
    // 채팅방 입장전 권한 사전검증 - personalId와 chatRoomId로 chatParticipants 존재 확인
    @Transactional(readOnly = true)
    public boolean isParticipantInChatRoom (String personalId, Long chatRoomId){
        //userId 찾기
        User user = findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with PersonalId: " + personalId));
        String userId = user.getId();

        return chatParticipantsRepository.findByChatRoom_IdAndUser_Id(chatRoomId, userId).isPresent();
    }

    // 채팅 메세지 가져오기
    @Transactional(readOnly = true)
    public ChatMessageResponse getMessagesByChatRoomId(Long chatRoomId, Long cursor) {
        if(cursor == null) cursor = Long.MAX_VALUE; // 커서가 null일 경우(채팅방 처음 접속)

        int limit = 5; // 한번에 가져올 메세지 수

        // 특정 채팅방의 모든 메시지 조회 - MessageId 기준 내림차순으로 (가장 최근 메세지부터)
        List<ChatMessage> messages = chatMessageRepository.findMessagesByCursor(chatRoomId, limit, cursor);
        Long nextCursor = messages.isEmpty() ? null : messages.get(messages.size()-1).getId(); // 가장오래된 메세지를 커서로 사용


        return ChatMessageResponse.builder()
                .messages(messages)
                .nextCursor(nextCursor)
                .build();
    }


    // 채팅방 생성 / 삭제
    // 두 사용자로 채팅방 찾기
    public Optional<ChatRoom> findRoomByParticipants(String userId, String otherId) {
        /*
        repository 수정필요
         */
        return chatRoomRepository.findChatRoomByParticipants(userId, otherId);
    }

    // 채팅방 만들기
    @Transactional
    public ChatRoom createChatRoom(String userId, String otherId) {

        // 채팅방 생성
        ChatRoom chatRoom = ChatRoom.builder()
                .lastMessageContent(null)
                .build();
        chatRoomRepository.save(chatRoom); // 채팅방 저장
        System.out.println("ChatRoom ID: " + chatRoom.getId());

        // 참여자 목록 생성 (userId와 otherId를 포함)
        List<String> participantIds = Arrays.asList(new String[]{userId, otherId});

        // 매핑만들기
        createChatParticipants(chatRoom, participantIds);

        return chatRoom;
    }

    //매핑관계만들기
    public void createChatParticipants(ChatRoom chatRoom, List<String> participantIds){
        // 참여자를 매핑 테이블에 추가
        for (String Id : participantIds) {
            User user = userRepository.findById(Id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with Id: " + Id ));
            ChatParticipants participant = ChatParticipants.builder()
                    .chatRoom(chatRoom)
                    .user(user)
                    .build();

            chatParticipantsRepository.save(participant); // 매핑관계 저장
        }
    }

    // 채팅방 목록 가져오기
    public List<ChatRoomResponse> getChatRoomsForUser(String userId) {

        // 1) (참여 테이블 + 방 테이블) JOIN FETCH로 한 번에 조회
        List<ChatParticipants> participants =
                chatParticipantsRepository.findByUserIdWithChatRoomFetch(userId);

        // 2) 채팅방 Id 목록 추출
        Set<Long> chatRoomIds = participants.stream()
                .map(cp -> cp.getChatRoom().getId())
                .collect(Collectors.toSet());


        // 3) 상대방 이름 추출, chatRoomId를 key로한 Map 만들어놔서 Dto 변환할때 효율성 추구
        Map<Long, String> otherUserNameMap =
                chatParticipantsRepository.findAllByChatRoomIdInAndNotUserId(chatRoomIds, userId).stream()
                        .collect(Collectors.toMap(
                                cp -> cp.getChatRoom().getId(),     // key
                                cp -> cp.getUser().getName()        // value
                        ));


        // 4) participants를 돌면서 DTO 구성
        return participants.stream().map(cp -> {
            ChatRoom cr = cp.getChatRoom();
            Long roomId = cr.getId();

            String otherUserName = otherUserNameMap.getOrDefault(roomId, "Unknown");

            return ChatRoomResponse.builder()
                    .chatRoomId(roomId)
                    .lastMessageContent(cr.getLastMessageContent())
                    .lastMessageTime(cr.getLastMessageTime())
                    .otherUser(otherUserName)
                    /*
                    추후 수정 필요
                     */
                    .unReadMessageCount(0) // chatParticipants에서 otherReadMessage 가져오기,
                    .build();
        }).collect(Collectors.toList());

    }

//    // 채팅참여 테이블, 메세지 읽음 처리
//    @Transactional
//    public ChatParticipants updateLastReadMessage(String personalId, Long chatRoomId) {
//        //userId 찾기
//        User user = findByPersonalId(personalId)
//                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with PersonalId: " + personalId));
//        String userId = user.getId();
//
//        // ChatParticipants 엔티티 찾기
//        ChatParticipants participant = chatParticipantsRepository.findByChatRoom_IdAndUser_Id(chatRoomId, userId)
//                .orElseThrow(() -> new IllegalArgumentException("Chat participant not found"));
//        // 가장 최근의 상대방 메세지 찾기
//        Long messageId = chatMessageRepository.findLastMessageIdByChatMessageId_ChatRoomIdAndNotUserId(chatRoomId, userId);
//        // 마지막으로 읽은 메시지 ID 업데이트 - 상대방 기준으로 업데이트해야함
//        participant.updateLastReadMessageId(messageId);
//
//        return participant;
//    }

    // 해당 채팅방 가져오기
    public Optional<ChatRoom> getChatRoomByChatRoomId(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId);
    }

    public Optional<User> findByPersonalId(String personalId){
        return userRepository.findByPersonalId(personalId);
    };

}
