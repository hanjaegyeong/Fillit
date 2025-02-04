package com.social.a406.domain.chat.websocket;

import lombok.Getter;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

// Key가 chatRoomId고 value가 webSocketSessionList인 Map
@Getter
@Component
public class WebSocketSessionMap {

    private final HashMap<Long, WebSocketSessionSet> webSocketSetHashMap;

    public WebSocketSessionMap() { this.webSocketSetHashMap = new HashMap<>(); }

    // 세션을 이용해 HashMap의 Key(ChatRoomId)를 가져오는 메서드 -> 채팅방 연결끊을때 쓰는거
    public Long getKeyFromSession(WebSocketSession session){
        for(Map.Entry<Long, WebSocketSessionSet> entry : webSocketSetHashMap.entrySet()) {
            if(entry.getValue().contains(session)){
                return entry.getKey();
            }
        }
        throw new IllegalArgumentException("Could not found the chatroom session.");
    }


    // chatRoomId로 채팅방 유무 확인후 없으면 생성 후 추가
    public void addSessionToChatRoom(Long chatRoomId, WebSocketSession session) {
        webSocketSetHashMap
                .computeIfAbsent(chatRoomId, k -> WebSocketSessionSet.builder()
                        .webSocketSessions(new HashSet<>())
                        .build())
                .add(session);
    }

    // SessionList 반환 메서드
    public WebSocketSessionSet getWebSocketSet (Long chatRoomId) {
        return webSocketSetHashMap.get(chatRoomId);
    }

    //세션 삭제 메서드
    public void removeSession(Long chatRoomId, WebSocketSession session) {
        WebSocketSessionSet sessionSet = getWebSocketSet(chatRoomId);

        if (sessionSet == null || sessionSet.isEmpty()) {
            return; // 이미 존재하지 않는 채팅방이면 아무것도 하지 않음
        }

        sessionSet.remove(session); // 세션 제거

        if (sessionSet.isEmpty()) {
            webSocketSetHashMap.remove(chatRoomId); // Map에서 제거
        }
    }


}
