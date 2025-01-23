package com.social.a406.domain.chat.service;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.entity.ChatMessage;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    @Autowired
    private ChatParticipantsRepository chatParticipantsRepository;
    @Autowired
    private UserRepository userRepository;


    // 채팅 저장
    @Transactional
    public ChatMessage saveMessageAndUpdateRoom(String userId, ChatMessageRequest request) {

        Long chatRoomId = request.getChatRoomId();
//        String nickName = request.getNickName();
//        User user = userRepository.findByNickname(nickName)
//                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with NickName: " + nickName));
//        String userId = user.getId();

        // 채팅참여 정보 가져오기
        ChatParticipants chatParticipants = chatParticipantsRepository.findByChatParticipantsId_ChatRoomIdAndChatParticipantsId_UserId(chatRoomId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with ID: " + chatRoomId + "," + userId));

        //해당 채팅방 내 마지막 메세지 찾기
        Optional<Long> lastMessageId = chatMessageRepository.findLastMessageIdByChatMessageId_ChatRoomId(chatRoomId);
        Long nextMessageId; // 메세지 아이디
        if(lastMessageId.isPresent()){
            nextMessageId = lastMessageId.get() + 1;
        }
        else{
            nextMessageId = 1L;
        }

        // 메시지 저장
        ChatMessage newMessage = ChatMessage.builder()
                .messageId(nextMessageId)
                .chatParticipants(chatParticipants)
                .messageContent(request.getMessageContent())
                .build();
        chatMessageRepository.save(newMessage);

        // 채팅방 마지막 메시지 정보 업데이트
        ChatRoom chatRoom = chatRoomRepository.findByChatRoomId(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found with ID: " + chatRoomId));
        chatRoom.updateLastMessageContent(newMessage.getMessageContent());
//        chatRoomRepository.save(chatRoom); 더티체킹하기때문에 따로 해줄 필요 x

        return newMessage;
    }

//    // 채팅 메세지 가져오기
//    @Transactional(readOnly = true)
//    public List<ChatMessage> getMessagesByChatRoomId(Long chatRoomId) {
//        // 특정 채팅방의 모든 메시지 조회
//        return chatMessageRepository.findByChatMessageId_ChatRoomId(chatRoomId);
//    }
//
    // 채팅방 생성 / 삭제
    // 두 사용자로 채팅방 찾기
    public Optional<ChatRoom> findRoomByParticipants(String userId, String otherId) {
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
        System.out.println("ChatRoom ID: " + chatRoom.getChatRoomId());

        // 참여자 목록 생성 (userId와 otherId를 포함)
        List<String> participantIds = Arrays.asList(new String[]{userId, otherId});

        // 참여자를 매핑 테이블에 추가
        for (String Id : participantIds) {
            User user = userRepository.findById(Id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with Id: " + Id ));
            ChatParticipants participant = ChatParticipants.builder()
                    .chatRoom(chatRoom)
                    .user(user)
                    .lastReadMessageId(null)
                    .build();

            System.out.println("ChatParticipants ID: " + participant.getChatParticipantsId());
            System.out.println("ChatParticipants ChatRoom ID: " + participant.getChatParticipantsId().getChatRoomId());
            System.out.println("ChatParticipants User ID: " + participant.getChatParticipantsId().getUserId());

            chatParticipantsRepository.save(participant); // 매핑관계 저장
        }
        return chatRoom;
    }
//
//    // 채팅방 목록 가져오기
//    public List<ChatRoomResponse> getChatRoomsForUser(String userId) {
//        List<ChatParticipants> participants = chatParticipantsRepository.findByChatParticipantsId_UserId(userId);
//        return participants.stream().map(participant -> {
//            ChatRoom chatRoom = participant.getChatRoom();
//            Long lastReadMessageId = participant.getLastReadMessageId();
//            Long unreadMessagesCount = chatMessageRepository.countByChatMessageId_ChatRoomIdAndChatMessageId_MessageIdGreaterThanExcludeUser(chatRoom.getChatRoomId(), lastReadMessageId, userId);
//
//            // 상대방 정보를 리포지토리에서 바로 가져옴
//            ChatParticipants otherParticipant = chatParticipantsRepository.findOtherParticipantByChatParticipantsId_ChatRoomIdAndChatParticipantsId_UserId(chatRoom.getChatRoomId(), userId)
//                    .orElse(null);  // 상대방 정보가 없는 경우 null 처리
//
//            String otherUserName = otherParticipant != null ? otherParticipant.getUser().getName() : "Unknown";
//
//            ChatRoomResponse response = new ChatRoomResponse();
//            response.setChatRoomId(chatRoom.getChatRoomId());
//            response.setLastMessageContent(chatRoom.getLastMessageContent());
//            response.setLastMessageTime(chatRoom.getLastMessageTime());
//            response.setOtherUser(otherUserName);
//            response.setUnReadMessageCount(unreadMessagesCount.intValue());
//
//            return response;
//        }).collect(Collectors.toList());
//    }
//
//    // 채팅참여 테이블, 메세지 읽음 처리
//    @Transactional
//    public void updateLastReadMessage(String userId, Long chatRoomId) {
//        // ChatParticipants 엔티티 찾기
//        ChatParticipants participant = chatParticipantsRepository.findByChatParticipantsId_ChatRoomIdAndChatParticipantsId_UserId(chatRoomId, userId)
//                .orElseThrow(() -> new IllegalArgumentException("Chat participant not found"));
//
//        Long messageId = chatMessageRepository.findLastMessageIdByChatMessageId_ChatRoomIdAndNotUserId(chatRoomId, userId);
//        // 마지막으로 읽은 메시지 ID 업데이트 -- 상대방 기준으로 업데이트해야함
//        participant.setLastReadMessageId(messageId);
//    }
//
//    // 해당 채팅방 가져오기
//    public Optional<ChatRoom> getChatRoomByChatRoomId(Long chatRoomId) {
//        return chatRoomRepository.findByChatRoomId(chatRoomId);
//    }
//
    public Optional<User> findByNickname(String nickname){
        return userRepository.findByNickname(nickname);
    };

}
