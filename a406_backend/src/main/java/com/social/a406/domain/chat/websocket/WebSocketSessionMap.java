package com.social.a406.domain.chat.websocket;

import lombok.Getter;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

// Key가 chatRoomId고 value가 webSocketSessionList인 Map
@Getter
@Component
public class WebSocketSessionMap {

    private final HashMap<Long, WebSocketSessionList> webSocketListHashMap ;

    public WebSocketSessionMap() { this.webSocketListHashMap = new HashMap<>(); }

    // 세션을 이용해 HashMap의 Key(ChatRoomId)를 가져오는 메서드 -> 채팅방 연결끊을때 쓰는거
    public Long getKeyFromSession(WebSocketSession session){
        for(Map.Entry<Long, WebSocketSessionList> entry : webSocketListHashMap.entrySet()) {
            if(entry.getValue().contains(session)){
                return entry.getKey();
            }
        }
        throw new IllegalArgumentException("Could not found the chatroom session.");
    }
}
