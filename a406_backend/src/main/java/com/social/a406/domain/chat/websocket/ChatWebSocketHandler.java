//package com.social.a406.domain.chat.websocket;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.social.a406.domain.chat.dto.ChatMessageRequest;
//import com.social.a406.domain.chat.service.ChatService;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.CloseStatus;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.Map;
//
//@Component
//public class ChatWebSocketHandler extends TextWebSocketHandler {
//    private final Map<Long, WebSocketSessionList> webSocketListHashMap;
//    private final WebSocketSessionMap webSocketSessionMap;
//    private final ChatService chatService;
//
//    public ChatWebSocketHandler(WebSocketSessionMap webSocketSessionMap, ChatService chatService) {
//        this.webSocketSessionMap = webSocketSessionMap;
//        this.webSocketListHashMap = webSocketSessionMap.getWebSocketListHashMap();
//        this.chatService = chatService;
//    }
//
//    // after
//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        Long chatRoomId = (Long) session.getAttributes().get("chatRoomId");
//        WebSocketSessionList sessionList = webSocketListHashMap.get(chatRoomId);
//
//        // 채팅방 유뮤 확인
//        if (sessionList == null) {
//            sessionList = WebSocketSessionList.builder()
//                    .webSocketSessions(new ArrayList<>())
//                    .build();
//            webSocketListHashMap.put(chatRoomId, sessionList);
//        }
//
//        sessionList.getWebSocketSessions().add(session);
//
//        System.out.println("Connected: " + session.getId());
//    }
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
//        ObjectMapper objectMapper = new ObjectMapper();
//        ChatMessageRequest chatMessageRequest = objectMapper.readValue(message.getPayload(), ChatMessageRequest.class);
//        Long chatRoomId = chatMessageRequest.getChatRoomId();
//
//        switch (chatMessageRequest.getType()) {
//            case ENTER: // 일단 비워둠
//                break;
//            case LEAVE:
//                leaveChatRoom(session, chatRoomId);
//                break;
//            case TEXT:
//                sendMessageToChatRoom(chatMessageRequest);
//                break;
//        }
//    }
//
//
//    private void sendMessageToChatRoom(ChatMessageRequest chatMessageRequest) throws IOException {
//        WebSocketSessionList sessionList = webSocketListHashMap.get(chatMessageRequest.getChatRoomId());
//        // 채팅 메세지 저장
//        chatService. saveMessageAndUpdateRoom(chatMessageRequest);
//
//        if (sessionList != null) {
//            TextMessage textMessage = new TextMessage(chatMessageRequest.getMessageContent());
//            for (WebSocketSession session : sessionList.getWebSocketSessions()) {
//                if (session.isOpen()) {
//                    session.sendMessage(textMessage);
//                }
//            }
//        }
//    }
//
//
//    private void leaveChatRoom(WebSocketSession session, Long chatRoomId) {
//        WebSocketSessionList sessionList = webSocketListHashMap.get(chatRoomId);
////        chatService.updateLastReadMessage((String) session.getAttributes().get("userId"), chatRoomId);
//        if (sessionList != null) {
//            sessionList.getWebSocketSessions().remove(session);
//            if (sessionList.getWebSocketSessions().isEmpty()) {
//                webSocketListHashMap.remove(chatRoomId); // 채팅방이 비었다면 목록에서 제거
//            }
//        }
//        System.out.println("User left chat room: " + session.getId());
//    }
//
//
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
//        // 연결 종료 시 세션 제거 로직
//        Long chatRoomId = (Long) session.getAttributes().get("chatRoomId");
//        leaveChatRoom(session, chatRoomId);
//        System.out.println("Disconnected: " + session.getId());
//    }
//}
