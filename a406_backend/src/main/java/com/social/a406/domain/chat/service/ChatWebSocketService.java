package com.social.a406.domain.chat.service;


import com.social.a406.domain.chat.dto.ChatMessageDto;
import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.entity.ChatMessage;
import com.social.a406.domain.chat.entity.ChatParticipants;
import com.social.a406.domain.chat.entity.ChatRoom;
import com.social.a406.domain.chat.repository.ChatMessageRepository;
import com.social.a406.domain.chat.repository.ChatParticipantsRepository;
import com.social.a406.domain.chat.repository.ChatRoomRepository;
import com.social.a406.domain.notification.service.NotificationService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.exception.ForbiddenException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor

public class ChatWebSocketService {
    private final ChatParticipantsRepository chatParticipantsRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // 메세지 저장
    @Transactional
    public ChatMessageDto saveMessage(String personalId, ChatMessageRequest request) {

        User user = findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("Chat Participants not found with PersonalId: " + personalId));
        String userId = user.getId();

        Long chatRoomId = request.getChatRoomId();

        // 채팅참여 정보 가져오기
        ChatParticipants chatParticipants = chatParticipantsRepository.findByChatRoom_IdAndUser_Id(chatRoomId, userId)
                .orElseThrow(() -> new ForbiddenException("Chat Participants not found with ID: " + chatRoomId + "," + userId));

        // 메시지 저장
        ChatMessage Message = ChatMessage.builder()
                .chatParticipants(chatParticipants)
                .messageContent(request.getMessageContent())
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(Message);

        return convertToChatMessageDto(savedMessage);
    }

    // 메세지 전부 읽기
    @Transactional
    public void readAllMessage(Long chatRoomId, String personalId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("Chat Participants not found with PersonalId: " + personalId));

        ChatParticipants chatParticipants = chatParticipantsRepository.findByChatRoom_IdAndUser_Id(chatRoomId, user.getId())
                .orElseThrow(() -> new ForbiddenException("ChatParticipants entity not found with ChatRoomId and UserId: " + chatRoomId +"," + user.getId()));

        chatParticipants.resetUnreadMessageCount();
    }
    
    // 메세지 증가시키기
    @Transactional
    public void increaseUnreadMessageAndUpdateRoom(ChatMessageRequest request, List<String> personalIdList, String personalId) {
        // 채팅방 마지막 메시지 정보 업데이트
        Long chatRoomId = request.getChatRoomId();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ForbiddenException("Chat room not found with ID: " + chatRoomId));
        chatRoom.updateLastMessageContent(request.getMessageContent());

        // 채팅 비참여자 안읽은 메세지 증가시키기
        // personalId → userId 변환
        List<String> userIdList = userRepository.findUserIdsByPersonalIds(personalIdList);

        // 한 번의 쿼리로 personalIdList에 없는 chatParticipants 조회
        List<ChatParticipants> chatParticipantsList = chatParticipantsRepository
                .findByChatRoomIdAndUserIdNotIn(chatRoomId, userIdList);

        // unReadMessageCount 증가
        chatParticipantsList.forEach(cp -> cp.increaseUnreadMessageCount());

        // 변경된 엔티티 저장
        chatParticipantsRepository.saveAll(chatParticipantsList);

        // 알람생성
        if(chatParticipantsList != null){
            for(ChatParticipants chatParticipant : chatParticipantsList) {
                notificationService.generateChatNotification(chatParticipant.getUser().getId(), personalId, chatRoomId);
            }
        }
//        if(personalIdList != null){
//            for(String receiverId : personalIdList) {
//                notificationService.generateChatNotification(receiverId, personalId, chatRoomId);
//            }
//        }

    }

    
    private ChatMessageDto convertToChatMessageDto (ChatMessage message) {
        User user = message.getChatParticipants().getUser();
        return new ChatMessageDto(message.getId(),
                user.getName(),
                user.getPersonalId(),
                message.getMessageContent(),
                message.getCreatedAt());
    }

    public Optional<User> findByPersonalId(String personalId) {
        return userRepository.findByPersonalId(personalId);
    }


}

