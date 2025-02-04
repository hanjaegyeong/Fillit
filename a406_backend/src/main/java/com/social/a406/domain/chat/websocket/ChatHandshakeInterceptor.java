package com.social.a406.domain.chat.websocket;

import com.social.a406.domain.chat.service.ChatService;
import com.social.a406.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class ChatHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;
    private final ChatService chatService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        System.out.println("Interceptor Starting");

        // 1. Authorization 헤더에서 JWT 추출
        String token = request.getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            response.setStatusCode(HttpStatus.FORBIDDEN);
            return false; // 인증 실패
        }
        token = token.substring(7); // "Bearer " 제거

        try {
            // 2. JWT에서 사용자 정보 추출
            String personalId = jwtTokenUtil.extractUsername(token); // personalId
            if (personalId == null) {
                response.setStatusCode(HttpStatus.FORBIDDEN);
                return false;
            }

            // 3. UserDetails 로드 및 JWT 검증
            UserDetails userDetails = userDetailsService.loadUserByUsername(personalId);
            if (!jwtTokenUtil.validateToken(token, userDetails)) {
                response.setStatusCode(HttpStatus.FORBIDDEN);
                return false;
            }

            // 4. 사용자 정보 WebSocketSession에 저장
            attributes.put("personalId", personalId);

            // 5. chatRoomId를 요청에서 추출하여 session에 저장
            String query = request.getURI().getQuery(); // e.g., "chatRoomId=3"

            // chatRoomId 추출
            Long chatRoomId = Optional.ofNullable(query)
                    .filter(q -> q.startsWith("chatRoomId="))
                    .map(q -> Long.parseLong(q.split("=")[1]))
                    .orElse(null);

            // 검증 및 저장 (chatRoomId가 없거나 personalId와 맞는 chatRoomId가 아닌경우)
            if (chatRoomId == null || !chatService.isParticipantInChatRoom(personalId, chatRoomId)) {
                response.setStatusCode(HttpStatus.BAD_REQUEST);
                return false; // chatRoomId가 없거나 유효하지 않은 경우
            }
            attributes.put("chatRoomId", chatRoomId);

            System.out.println("WebSocketHandShake Success! ChatRoomId:" +chatRoomId);
            return true; // 인증 성공 및 chatRoomId 설정 완료

        } catch (Exception e) {
            // 예외 발생 시 403 응답
            response.setStatusCode(HttpStatus.FORBIDDEN);
            return false;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception ex) {
        // 핸드셰이크 완료 후 추가 작업 (필요할 경우)
    }
}
