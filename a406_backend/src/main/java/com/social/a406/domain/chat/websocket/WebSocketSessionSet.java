package com.social.a406.domain.chat.websocket;

import lombok.Builder;
import lombok.Getter;
import org.springframework.web.socket.WebSocketSession;

import java.util.Set;

@Getter
public class WebSocketSessionSet {
    private Set<WebSocketSession> webSocketSessions;

    @Builder
    public WebSocketSessionSet(Set<WebSocketSession> webSocketSessions) {
        this.webSocketSessions = webSocketSessions;
    }

    // 해당세션을 포함하는지 확인하는 메서드
    public boolean contains(WebSocketSession session) {return webSocketSessions.contains(session);}
    public void add(WebSocketSession session) {webSocketSessions.add(session);}
    public void remove(WebSocketSession session) {webSocketSessions.remove(session);}
    public boolean isEmpty () {return webSocketSessions.isEmpty();}
}
