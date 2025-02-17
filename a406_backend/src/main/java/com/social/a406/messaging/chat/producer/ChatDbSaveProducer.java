package com.social.a406.messaging.chat.producer;

import com.social.a406.messaging.chat.dto.ChatDbSaveMessage;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
public class ChatDbSaveProducer {
    private final RabbitTemplate rabbitTemplate;
    private final TopicExchange topicExchange;

    public void sendDbSaveMessage(ChatDbSaveMessage event) {
        rabbitTemplate.convertAndSend(topicExchange.getName(), "chat.db.save", event);
    }
}
