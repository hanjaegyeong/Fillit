package com.social.a406.domain.chat.service;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.dto.ChatRoomResponse;
import com.social.a406.domain.chat.entity.ChatMessage;
import com.social.a406.domain.chat.entity.ChatMessageId;
import com.social.a406.domain.chat.entity.ChatParticipants;
import com.social.a406.domain.chat.entity.ChatRoom;
import com.social.a406.domain.chat.repository.ChatMessageRepository;
import com.social.a406.domain.chat.repository.ChatParticipantsRepository;
import com.social.a406.domain.chat.repository.ChatRoomRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    private ChatRoomRepository chatRoomRepository;
    private ChatParticipantsRepository chatParticipantsRepository;
    private UserRepository userRepository;


    // 채팅 저장
    @Transactional
    public ChatMessage saveMessageAndUpdateRoom(ChatMessageRequest request) {

        Long chatRoomId = request.getChatRoomId();
        String userId = request.getUserId();

        // 채팅참여 정보 가져오기
        ChatParticipants chatParticipants = chatParticipantsRepository.findByChatRoomIdAndUserId(chatRoomId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with ID: " + chatRoomId + "," + userId));

        //해당 채팅방 내 마지막 메세지 찾기
        Long lastMessageId = chatMessageRepository.findLastMessageIdByChatRoomId(chatRoomId);
        Long nextMessageId = lastMessageId == null ? 1 : lastMessageId + 1; // chatMessageId에 1씩 더 증가시켜서 저장하기

        // 메시지 저장
        ChatMessage newMessage = new ChatMessage();
        newMessage.setChatMessageId(new ChatMessageId(chatRoomId, nextMessageId));
//        newMessage.setChatRoom(chatParticipants);
        newMessage.setMessageContent(request.getMessageContent());
        newMessage.setCreateAt(LocalDateTime.now());
        chatMessageRepository.save(newMessage);

        // 채팅방 마지막 메시지 정보 업데이트
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found with ID: " + chatRoomId));
        chatRoom.setLastMessageContent(newMessage.getMessageContent());
        chatRoom.setLastMessageTime(newMessage.getCreateAt());

        return newMessage;
    }

    // 채팅 메세지 가져오기
    @Transactional(readOnly = true)
    public List<ChatMessage> getMessagesByChatRoomId(Long chatRoomId) {
        // 특정 채팅방의 모든 메시지 조회
        return chatMessageRepository.findByChatRoomId(chatRoomId);
    }

    // 채팅방 생성 / 삭제
    // 두 사용자로 채팅방 찾기
    public Optional<ChatRoom> findRoomByParticipants(String userId, String otherId) {
        return chatRoomRepository.findChatRoomByParticipants(userId, otherId);
    }

    // 채팅방 만들기
    @Transactional
    public ChatRoom createChatRoom(String userId, String otherId) {
        // 채팅방 생성
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setLastMessageContent("");  // 초기 메시지 내용 비워두기
        chatRoom.setLastMessageTime(null);  // 초기 메시지 시간 설정하지 않음
        chatRoom = chatRoomRepository.save(chatRoom);

        // 참여자 목록 생성 (userId와 otherId를 포함)
        List<String> participantIds = Arrays.asList(new String[]{userId, otherId});

        // 참여자를 매핑 테이블에 추가
        for (String Id : participantIds) {
            User user = userRepository.findById
                            (Id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with Id: " + Id));
            ChatParticipants participant = new ChatParticipants();
            participant.setChatRoom(chatRoom);
            participant.setUser(user);
            participant.setLastReadMessageId(null);  // 초기 읽은 메시지 ID 설정하지 않음
            chatParticipantsRepository.save(participant);
        }
        return chatRoom;
    }

    // 채팅방 목록 가져오기
    public List<ChatRoomResponse> getChatRoomsForUser(String userId) {
        List<ChatParticipants> participants = chatParticipantsRepository.findByUserId(userId);
        return participants.stream().map(participant -> {
            ChatRoom chatRoom = participant.getChatRoom();
            Long lastReadMessageId = participant.getLastReadMessageId();
            Long unreadMessagesCount = chatMessageRepository.countByChatRoomIdAndMessageIdGreaterThanExcludeUser(chatRoom.getId(), lastReadMessageId, userId);

            // 상대방 정보를 리포지토리에서 바로 가져옴
            ChatParticipants otherParticipant = chatParticipantsRepository.findOtherParticipantByChatRoomIdAndUserId(chatRoom.getId(), userId)
                    .orElse(null);  // 상대방 정보가 없는 경우 null 처리

            String otherUserName = otherParticipant != null ? otherParticipant.getUser().getName() : "Unknown";

            ChatRoomResponse response = new ChatRoomResponse();
            response.setChatRoomId(chatRoom.getId());
            response.setLastMessageContent(chatRoom.getLastMessageContent());
            response.setLastMessageTime(chatRoom.getLastMessageTime());
            response.setOtherUser(otherUserName);
            response.setUnReadMessageCount(unreadMessagesCount.intValue());

            return response;
        }).collect(Collectors.toList());
    }

    // 채팅참여 테이블, 메세지 읽음 처리
    @Transactional
    public void updateLastReadMessage(String userId, Long chatRoomId) {
        // ChatParticipants 엔티티 찾기
        ChatParticipants participant = chatParticipantsRepository.findByChatRoomIdAndUserId(chatRoomId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Chat participant not found"));

        Long messageId = chatMessageRepository.findLastMessageIdByChatRoomIdAndNotUserId(chatRoomId, userId);
        // 마지막으로 읽은 메시지 ID 업데이트 -- 상대방 기준으로 업데이트해야함
        participant.setLastReadMessageId(messageId);
    }

    // 해당 채팅방 가져오기
    public Optional<ChatRoom> getChatRoomByChatRoomId(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId);
    }

    public Optional<User> findByNickname(String nickname){
        return userRepository.findByNickname(nickname);
    };

}
