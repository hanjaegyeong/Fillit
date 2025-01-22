package com.social.a406.domain.chat.controller;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.dto.ChatRoomResponse;
import com.social.a406.domain.chat.entity.ChatMessage;
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
    /*
    refactor 목록
    1. Interceptor: 웹소켓에서 채팅방에 접근권한 있는 유저인지 db에서 체크
    2. controller - 메세지 저장시 권한 맞는 유저인지 체크
                  - 채팅방 접근시 권한 맞는 유저인지 체크
     */

    // 메세지 저장 -user검증 필요?
    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> saveMessage(@RequestBody ChatMessageRequest request) {
        ChatMessage message = chatService.saveMessageAndUpdateRoom(request);
        return ResponseEntity.ok(message);
    }

    //채팅방 입장 (채팅 목록에서) - 메세지 목록 가져오기 - user검증 필요?
    @GetMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessagesByChatRoomId(@PathVariable Long chatRoomId) {
        List<ChatMessage> messages = chatService.getMessagesByChatRoomId(chatRoomId);
        return ResponseEntity.ok(messages);
    }

    //채팅방 입장 (프로필에서) - 채팅방 유무 검증 후 메세지 목록 가져오기
    @GetMapping("/rooms/messages")
    public ResponseEntity<List<ChatMessage>> getMessagesOnPorfile(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String otherNickname) {

        String userId = chatService.findByNickname(userDetails.getUsername()).get().getId();
        String otherId = chatService.findByNickname(otherNickname).get().getId();

        Optional<ChatRoom> chatRoom = chatService.findRoomByParticipants(userId, otherId);
        if(!chatRoom.isPresent()) { // 비어있으면 채팅방 생성
            chatRoom = Optional.ofNullable(chatService.createChatRoom(userId, otherId));
        }
        // 채팅메세지 목록 보여주기
        List<ChatMessage> messages = chatService.getMessagesByChatRoomId(chatRoom.get().getId());
        return ResponseEntity.ok(messages);
    }

    // 채팅방 목록 가져오기
    @GetMapping("/rooms/list")
    public ResponseEntity<List<ChatRoomResponse>> getChatRoomsForUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = chatService.findByNickname(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String userId = user.getId();
        List<ChatRoomResponse> chatRooms = chatService.getChatRoomsForUser(userId);
        return ResponseEntity.ok(chatRooms);
    }


}

