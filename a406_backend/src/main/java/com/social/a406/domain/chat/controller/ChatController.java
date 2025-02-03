package com.social.a406.domain.chat.controller;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.dto.ChatRoomResponse;
import com.social.a406.domain.chat.entity.ChatMessage;
import com.social.a406.domain.chat.entity.ChatRoom;
import com.social.a406.domain.chat.service.ChatService;
import com.social.a406.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // 메세지 저장
    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> saveMessage(@AuthenticationPrincipal UserDetails userDetails, @RequestBody ChatMessageRequest request) {
        String personalId = userDetails.getUsername();
        ChatMessage message = chatService.saveMessageAndUpdateRoom(personalId, request);
        return ResponseEntity.ok(message);
    }

    //채팅방 입장 - 메세지 목록 가져오기
    @GetMapping("/rooms/messages")
    public ResponseEntity<?> getMessagesByChatRoomId(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Long chatRoomId) {
        // 접근권한 검증
        if(!chatService.isParticipantInChatRoom(userDetails.getUsername(), chatRoomId)){
            return ResponseEntity.badRequest().body("You do not have permission to access this chat room: " + userDetails.getUsername() + ", " + chatRoomId);
        }
        // 메세지 목록 가져오기
        List<ChatMessage> messages = chatService.getMessagesByChatRoomId(chatRoomId);
        return ResponseEntity.ok(messages);
    }

    //채팅방 입장 (프로필에서) - 채팅방 유무 검증 후 없으면 채팅방 생성하기
    @PostMapping("/rooms/messages")
    public ResponseEntity<ChatRoom> getMessagesOnProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestParam String otherPersonalId) {

        String personalId = userDetails.getUsername();
        User user = chatService.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with PersonalId: " + personalId));
        User other = chatService.findByPersonalId(otherPersonalId)
                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with PersonalId: " + otherPersonalId));

        String userId = user.getId();
        String otherId = other.getId();

        Optional<ChatRoom> chatRoom = chatService.findRoomByParticipants(userId, otherId);

        if(!chatRoom.isPresent()) { // 비어있으면 채팅방 생성
            chatRoom = Optional.ofNullable(chatService.createChatRoom(userId, otherId));
        }
        // 채팅메세지 목록 보여주기
//        List<ChatMessage> messages = chatService.getMessagesByChatRoomId(chatRoom.get().getChatRoomId());
        return ResponseEntity.status(201).body(chatRoom.get());
    }

    // 채팅방 목록 가져오기
    @GetMapping("/rooms/list")
    public ResponseEntity<List<ChatRoomResponse>> getChatRoomsForUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = chatService.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with PersonalId: " + userDetails.getUsername()));
        String userId = user.getId();

        List<ChatRoomResponse> chatRooms = chatService.getChatRoomsForUser(userId);
        return ResponseEntity.ok(chatRooms);
    }

//    // 마지막 메세지 읽음처리
//    @PatchMapping("/rooms/read")
//    public ResponseEntity<?> ReadMessage(@AuthenticationPrincipal UserDetails userDetails, @RequestParam Long chatRoomId){
//        User user = chatService.findByPersonalId(userDetails.getUsername())
//                .orElseThrow(() -> new IllegalArgumentException("Chat Participants not found with PersonalId: " + userDetails.getUsername()));
//        String userId = user.getId();
//
//        ChatParticipants participants = chatService.updateLastReadMessage( userId, chatRoomId);
//
//        return ResponseEntity.ok(participants);
//    }

}

