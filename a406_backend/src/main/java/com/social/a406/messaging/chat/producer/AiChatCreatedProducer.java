package com.social.a406.messaging.chat.producer;

import com.social.a406.messaging.chat.dto.AiChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiChatCreatedProducer {
    private final RabbitTemplate rabbitTemplate;
    private final TopicExchange topicExchange;

    public void sendAiChatCreatedMessage(AiChatMessage event){
        rabbitTemplate.convertAndSend(topicExchange.getName(), "chat.ai.created", event);
    }

}
