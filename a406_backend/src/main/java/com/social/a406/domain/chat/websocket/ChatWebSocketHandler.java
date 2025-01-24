package com.social.a406.domain.chat.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.service.ChatService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final Map<Long, WebSocketSessionList> webSocketListHashMap;
    private final WebSocketSessionMap webSocketSessionMap;
    private final ChatService chatService;

    public ChatWebSocketHandler(WebSocketSessionMap webSocketSessionMap, ChatService chatService) {
        this.webSocketSessionMap = webSocketSessionMap;
        this.webSocketListHashMap = webSocketSessionMap.getWebSocketListHashMap();
        this.chatService = chatService;
    }

    // after
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long chatRoomId = (Long) session.getAttributes().get("chatRoomId");
        WebSocketSessionList sessionList = webSocketListHashMap.get(chatRoomId);

        // 채팅방 유뮤 확인
        if (sessionList == null) {
            sessionList = WebSocketSessionList.builder()
                    .webSocketSessions(new ArrayList<>())
                    .build();
        }
        // 세션 추가 해주기
        sessionList.getWebSocketSessions().add(session);
        webSocketListHashMap.put(chatRoomId, sessionList);

        System.out.println("Connected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        ChatMessageRequest chatMessageRequest = objectMapper.readValue(message.getPayload(), ChatMessageRequest.class);

        Long chatRoomIdFromMessage = chatMessageRequest.getChatRoomId();
        Long chatRoomId = (Long) session.getAttributes().get("chatRoomId");

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

        String userId = (String) session.getAttributes().get("userId");

        switch (chatMessageRequest.getType()) {
            case ENTER: // 일단 비워둠
                break;
            case LEAVE:
                leaveChatRoom(userId, session, chatRoomId);
                break;
            case TEXT:
                sendMessageToChatRoom(userId, chatMessageRequest);
                break;
        }
    }


    private void sendMessageToChatRoom(String userId, ChatMessageRequest chatMessageRequest) throws IOException {
        WebSocketSessionList sessionList = webSocketListHashMap.get(chatMessageRequest.getChatRoomId());
        // 채팅 메세지 저장
        chatService. saveMessageAndUpdateRoom(userId, chatMessageRequest);

        if (sessionList != null) {
            TextMessage textMessage = new TextMessage(chatMessageRequest.getMessageContent());
            for (WebSocketSession session : sessionList.getWebSocketSessions()) {
                if (session.isOpen()) {
                    session.sendMessage(textMessage);
                }
            }
        }
    }


    private void leaveChatRoom(String userId, WebSocketSession session, Long chatRoomId) {
        WebSocketSessionList sessionList = webSocketListHashMap.get(chatRoomId);

        // 나갈 때 마지막 메시지 읽음 처리
        chatService.updateLastReadMessage(userId, chatRoomId);

        if (sessionList != null) {
            sessionList.getWebSocketSessions().remove(session);
            if (sessionList.getWebSocketSessions().isEmpty()) {
                webSocketListHashMap.remove(chatRoomId);
                System.out.println("Chat room " + chatRoomId + " is now empty and removed.");
            }
        }
        System.out.println("User " + userId + " left chat room: " + session.getId());
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // 연결 종료 시 세션 제거 로직
        String userId = (String) session.getAttributes().get("userId");
        Long chatRoomId = (Long) session.getAttributes().get("chatRoomId");
        leaveChatRoom(userId ,session, chatRoomId);
        System.out.println("Disconnected: " + session.getId());
    }
}
