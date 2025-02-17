package com.social.a406.messaging.chat.producer;

import com.social.a406.messaging.chat.dto.ChatRoomUpdateMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatRoomUpdateProducer {
    private final RabbitTemplate rabbitTemplate;
    private final TopicExchange topicExchange;

    public void sendUpdateMessage(ChatRoomUpdateMessage event) {
        rabbitTemplate.convertAndSend(topicExchange.getName(), "chat.room.update", event);
    }
}