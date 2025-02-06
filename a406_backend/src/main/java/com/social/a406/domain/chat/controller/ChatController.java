package com.social.a406.domain.chat.controller;

import com.social.a406.domain.chat.dto.ChatMessageDto;
import com.social.a406.domain.chat.dto.ChatMessageListResponse;
import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.dto.ChatRoomResponse;
import com.social.a406.domain.chat.entity.ChatRoom;
import com.social.a406.domain.chat.service.ChatService;
import com.social.a406.domain.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }


    // 메세지 저장
    @PostMapping("/messages")
    public ResponseEntity<ChatMessageDto> saveMessage( // 나중엔 void로
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChatMessageRequest request) {
        String personalId = userDetails.getUsername();
        return ResponseEntity.ok(chatService.saveMessageAndUpdateRoom(personalId, request));
    }

    //채팅방 입장 - 메세지 목록 가져오기
    @GetMapping("/rooms/messages")
    public ResponseEntity<?> getMessagesByChatRoomId(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long chatRoomId,
            @RequestParam(required = false) Long cursor) { // 30개씩 가져오기 cursor는 그 이후의 거부터 가져오는거 즉 첫번째 메세지는 cursor가 null 일 수도 있음

        // 접근권한 검증
        if(!chatService.isParticipantInChatRoom(userDetails.getUsername(), chatRoomId)){
            return ResponseEntity.badRequest().body("You do not have permission to access this chat room: " + userDetails.getUsername() + ", " + chatRoomId);
        }
        // 메세지 목록 가져오기
        ChatMessageListResponse messages = chatService.getMessagesByChatRoomId(chatRoomId, cursor);
        return ResponseEntity.ok(messages);
    }

    //채팅방 입장 (프로필에서) - 채팅방 유무 검증 후 없으면 채팅방 생성하기
    @PostMapping("/rooms/messages")
    public ResponseEntity<ChatRoomResponse> getMessagesOnProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String otherPersonalId) {

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

        return ResponseEntity.ok(chatService.convertToChatRoomResponse(chatRoom.get(), userId,other)); // dto로 mapping 해서 반환
    }

    // 채팅방 목록 가져오기
    @GetMapping("/rooms/list")
    public ResponseEntity<List<ChatRoomResponse>> getChatRoomsForUser(
            @AuthenticationPrincipal UserDetails userDetails) {
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

