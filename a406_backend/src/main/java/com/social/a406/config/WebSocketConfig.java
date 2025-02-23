package com.social.a406.config;

import com.social.a406.domain.chat.websocket.ChatHandshakeInterceptor;
import com.social.a406.domain.chat.websocket.ChatWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatWebSocketHandler chatWebSocketHandler;
    private final ChatHandshakeInterceptor handshakeInterceptor;

    public WebSocketConfig(ChatWebSocketHandler chatWebSocketHandler, ChatHandshakeInterceptor handshakeInterceptor) {
        this.chatWebSocketHandler = chatWebSocketHandler;
        this.handshakeInterceptor = handshakeInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // WebSocket URL 매핑
        registry.addHandler(chatWebSocketHandler, "/ws/chat") // 핸들러 등록 경로
                .addInterceptors(handshakeInterceptor) // 인터셉터 추가
                .setAllowedOrigins("*"); // 허용된 Origin 설정 (*: 모두 허용)
    }
}