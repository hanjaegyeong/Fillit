package com.social.a406.domain.chat.websocket;

import lombok.Builder;
import lombok.Getter;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;

@Getter
public class WebSocketSessionList {
    private List<WebSocketSession> webSocketSessions;

    @Builder
    public WebSocketSessionList(List<WebSocketSession> webSocketSessions) {
        this.webSocketSessions = webSocketSessions;
    }


    // 해당세션을 포함하는지 확인하는 메서드
    public boolean contains(WebSocketSession session) {return webSocketSessions.contains(session);}
}
