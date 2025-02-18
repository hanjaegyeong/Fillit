package com.social.a406.messaging.chat.consumer;

import com.social.a406.domain.chat.service.ChatWebSocketService;
import com.social.a406.messaging.chat.dto.ChatDbSaveMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ChatDbSaveConsumer {
    private final ChatWebSocketService chatWebSocketService; // DB 저장 로직 포함

    @RabbitListener(queues = "chat.db.save", concurrency = "2")
    public void receiveChatDbMessage(ChatDbSaveMessage event) {
        // 메시지 DB 저장 로직 실행
        chatWebSocketService.saveMessage(event.getPersonalId(), event.getChatMessageRequest());
    }
}
