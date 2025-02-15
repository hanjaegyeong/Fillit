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
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

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

        MultiValueMap<String, String> params = UriComponentsBuilder.fromUri(request.getURI()).build().getQueryParams();
        String token = params.getFirst("jwt");
        Long chatRoomId = Long.valueOf(params.getFirst("chatRoomId"));
        System.out.println("jwt: "+token);
        System.out.println("chatRoomId: "+chatRoomId);

        try {
            // 2. JWT에서 사용자 정보 추출
            String personalId = jwtTokenUtil.extractUsername(token); // personalId
            if (personalId == null) {
                response.setStatusCode(HttpStatus.FORBIDDEN);
                System.err.println("Error: Theres No Invalid personalId");
                return false;
            }
            System.out.println(" 2. I found my Personal Id :" + personalId);


            // 3. UserDetails 로드 및 JWT 검증
            UserDetails userDetails = userDetailsService.loadUserByUsername(personalId);
            if (!jwtTokenUtil.validateToken(token, userDetails)) {
                response.setStatusCode(HttpStatus.FORBIDDEN);
                System.err.println("Error: PersonalId mismatch! personalId: " + userDetails.getUsername());
                return false;
            }
            System.out.println(" 3. I check my Personal Id is vaild :" + personalId);



            // 4. 사용자 정보 WebSocketSession에 저장
            attributes.put("personalId", personalId);

            // 5. chatRoomId를 요청에서 추출하여 session에 저장
            System.out.println(" 4. Personal Id is exist yet :" + personalId);
            System.out.println(" 4. chatRoom Id is exist yet :" + personalId);

            // 검증 및 저장 (chatRoomId가 없거나 personalId와 맞는 chatRoomId가 아닌경우)
            if (chatRoomId == null || !chatService.isParticipantInChatRoom(personalId, chatRoomId)) {
                response.setStatusCode(HttpStatus.BAD_REQUEST);
                System.err.println("Error: chatRoomId mismatch! Message chatRoomId: " + chatRoomId);

                return false; // chatRoomId가 없거나 유효하지 않은 경우
            }
            attributes.put("chatRoomId", chatRoomId);
            System.out.println("WebSocketHandShake Success! ChatRoomId:" + chatRoomId);
            return true; // 인증 성공 및 chatRoomId 설정 완료

        }
        catch (Exception e) {
            System.err.println("WebInterceptor is borekn:" + e.getMessage());
            return false;
        }

    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception ex) {
        // 핸드셰이크 완료 후 추가 작업 (필요할 경우)
    }
}
