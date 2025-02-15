package com.social.a406.domain.chat.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.chat.dto.ChatMessageDto;
import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.entity.ChatParticipants;
import com.social.a406.domain.chat.event.AIChatMessageEvent;
import com.social.a406.domain.chat.event.MessageCreatedEvent;
import com.social.a406.domain.chat.event.UnreadMessageEvent;
import com.social.a406.domain.chat.messageQueue.MessageQueueService;
import com.social.a406.domain.chat.repository.ChatParticipantsRepository;
import com.social.a406.domain.chat.service.ChatWebSocketService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final WebSocketSessionMap webSocketSessionMap;
    private final ChatWebSocketService chatWebSocketService;
    private final ApplicationEventPublisher eventPublisher;
    private final ChatParticipantsRepository chatParticipantsRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper; // ✅ Spring이 자동으로 등록한 ObjectMapper 사용
    private final MessageQueueService messageQueueService;
    private final JsonUtil jsonUtil;

    // after
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Handler Starting");

        Long chatRoomId = (Long) session.getAttributes().get("chatRoomId");
        String personalId = (String) session.getAttributes().get("personalId");

        // 해당 채팅방의 메세지 전부 읽음처리
        chatWebSocketService.readAllMessage(chatRoomId, personalId);

        // chatRoomId로 채팅방 유무 확인후 없으면 생성 후 추가
        webSocketSessionMap.addSessionToChatRoom(chatRoomId, session);
        System.out.println("Connected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        ChatMessageRequest chatMessageRequest = objectMapper.readValue(message.getPayload(), ChatMessageRequest.class);

        Long chatRoomIdFromMessage = chatMessageRequest.getChatRoomId();

        Long chatRoomId = (Long) session.getAttributes().get("chatRoomId");
        String personalId = (String) session.getAttributes().get("personalId");

        // chatRoomId 의도적 조작여부 검증
        if (!chatRoomId.equals(chatRoomIdFromMessage)) {
            System.err.println("Error: chatRoomId mismatch! Message chatRoomId: " + chatRoomIdFromMessage +
                    ", Session chatRoomId: " + chatRoomId);
            // 클라이언트로 오류 응답 전송
            session.sendMessage(new TextMessage(
                    "Error: You are not allowed to send messages to this chat room."
            ));
            return; // 메시지 처리 중단
        }

        // ai인지 아닌지 확인 후 ai 면 메세지생성
        isReceiverAI(chatRoomId,  personalId, chatMessageRequest);

        switch (chatMessageRequest.getType()) {
            case TEXT: {
                messageQueueService.addMessageToQueue(() -> {
                    try {
                        sendMessageToChatRoom(personalId, chatMessageRequest);
                    } catch (Exception e) {
                        System.err.println("Failed to send User Message: " + e.getMessage());
                    }
                });
            }
                break;
            case LEAVE:
                leaveChatRoom(personalId, session, chatRoomId);
                break;
        }
    }


    public void sendMessageToChatRoom(String personalId, ChatMessageRequest chatMessageRequest) throws Exception {
        Long chatRoomId = chatMessageRequest.getChatRoomId();
        WebSocketSessionSet sessionSet = webSocketSessionMap.getWebSocketSet(chatRoomId);

            // 보낸 사람(User) 정보 조회
            User sender = userRepository.findByPersonalId(personalId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // ChatMessageDto 생성
            ChatMessageDto chatMessageDto = new ChatMessageDto(
                    null, // 메시지 ID는 아직 없음 (DB 저장 후 업데이트될 수도 있음)
                    sender.getName(),
                    sender.getPersonalId(),
                    chatMessageRequest.getMessageContent(),
                    LocalDateTime.now()
            );

        // 메세지 broadCast
        List<String> personalIdList = new ArrayList<>(); // 현재 채팅방에 접속중인 personalId 목록

        if (sessionSet != null) {
            // ChatMessageDto를 JSON으로 변환
            String chatMessageJson = jsonUtil.toJson(chatMessageDto);
            TextMessage textMessage = new TextMessage(chatMessageJson);

            for (WebSocketSession session : sessionSet.getWebSocketSessions()) {
                synchronized (session) { // ✅ WebSocket 세션을 동기화하여 중복 실행 방지
                    if (session.isOpen()) {
                        session.sendMessage(textMessage);
                        personalIdList.add((String) session.getAttributes().get("personalId")); // 접속중인 personalId 추가
                    }
                }
            }// end of for
        }

            // 비동기 이벤트 발행 (메시지 저장을 별도로 처리)
            eventPublisher.publishEvent(new MessageCreatedEvent(personalId, chatMessageRequest));
            eventPublisher.publishEvent(new UnreadMessageEvent(chatMessageRequest, personalIdList, personalId));


    }

    private void leaveChatRoom(String personalId, WebSocketSession session, Long chatRoomId) {
        // 세션삭제 메서드
        webSocketSessionMap.removeSession(chatRoomId, session);

        System.out.println("User " + personalId + " left chat room: " + session.getId());
    }

    // AI면 메세지 생성
    private void isReceiverAI(Long chatRoomId, String personalId, ChatMessageRequest chatMessageRequest) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with PersonalId: " + personalId));
        ChatParticipants otherParticipants = chatParticipantsRepository. findOtherParticipants(chatRoomId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("ChatParticipants not found with chatRoomId: " + chatRoomId));

        User aiUser = otherParticipants.getUser();
        // ai 면 메세지생성
        if(aiUser.getMainPrompt() != null) {
            System.out.println("Receiver is AI. Start to create Message.");
            eventPublisher.publishEvent(new AIChatMessageEvent(aiUser, user.getName(),chatMessageRequest));
        }

    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // 연결 종료 시 세션 제거 로직
        String personalId = (String) session.getAttributes().get("personalId");
        Long chatRoomId = (Long) session.getAttributes().get("chatRoomId");
        leaveChatRoom(personalId ,session, chatRoomId);
        System.out.println("Disconnected: " + session.getId());
    }

}
