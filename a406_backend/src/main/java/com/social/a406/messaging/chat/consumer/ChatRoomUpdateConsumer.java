package com.social.a406.messaging.chat.consumer;

import com.social.a406.domain.chat.event.UnreadMessageEvent;
import com.social.a406.domain.chat.service.ChatWebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ChatRoomUpdateConsumer {
    private final ChatWebSocketService chatWebSocketService; // DB 저장 로직 포함

    @RabbitListener(queues = "chat.room.update", concurrency = "2")
    public void handleUnreadMessageEvent(UnreadMessageEvent event) {
        chatWebSocketService.increaseUnreadMessageAndUpdateRoom(event.getRequest(), event.getPersonalIdList(), event.getPersonalId());
    }
}
