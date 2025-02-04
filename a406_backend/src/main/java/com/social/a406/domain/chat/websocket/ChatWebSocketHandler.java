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

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
//    private final Map<Long, WebSocketSessionList> webSocketListHashMap;
    private final WebSocketSessionMap webSocketSessionMap;
    private final ChatService chatService;

    public ChatWebSocketHandler(WebSocketSessionMap webSocketSessionMap, ChatService chatService) {
        this.webSocketSessionMap = webSocketSessionMap;
        this.chatService = chatService;
    }

    public WebSocketSessionMap getWebSocketSessionMap() {
        return webSocketSessionMap;
    }

    // after
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long chatRoomId = (Long) session.getAttributes().get("chatRoomId");

        // chatRoomId로 채팅방 유무 확인후 없으면 생성 후 추가
        webSocketSessionMap.addSessionToChatRoom(chatRoomId, session);
        System.out.println("Connected: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
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

        switch (chatMessageRequest.getType()) {
            case TEXT:
                sendMessageToChatRoom(personalId, chatMessageRequest);
                break;
            case LEAVE:
                leaveChatRoom(personalId, session, chatRoomId);
                break;
        }
    }


    private void sendMessageToChatRoom(String personalId, ChatMessageRequest chatMessageRequest) throws IOException {
//        WebSocketSessionSet sessionList = webSocketSessionMap.get(chatMessageRequest.getChatRoomId());
        WebSocketSessionSet sessionSet = webSocketSessionMap.getWebSocketSet(chatMessageRequest.getChatRoomId());

        // 채팅 메세지 저장
        chatService. saveMessageAndUpdateRoom(personalId, chatMessageRequest);

        // 메세지 broadCast
        if (sessionSet != null) {
            TextMessage textMessage = new TextMessage(chatMessageRequest.getMessageContent());
            for (WebSocketSession session : sessionSet.getWebSocketSessions()) {
                if (session.isOpen()) {
                    session.sendMessage(textMessage);
                }
            }
        }
    }

    private void leaveChatRoom(String personalId, WebSocketSession session, Long chatRoomId) {
//        Set<WebSocketSession> sessionSet = webSocketSessionMap.getWebSocketSet(chatRoomId);

        // 나갈 때 마지막 메시지 읽음 처리
        chatService.updateLastReadMessage(personalId, chatRoomId);

        // 세션삭제 메서드
        webSocketSessionMap.removeSession(chatRoomId, session);

        System.out.println("User " + personalId + " left chat room: " + session.getId());
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
