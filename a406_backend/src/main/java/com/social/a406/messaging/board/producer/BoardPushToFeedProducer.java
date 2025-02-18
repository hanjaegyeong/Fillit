package com.social.a406.messaging.board.producer;

import com.social.a406.messaging.board.dto.BoardCreatedMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardPushToFeedProducer {
    private final RabbitTemplate rabbitTemplate;
    private final TopicExchange topicExchange;

    public void sendBoardCreateMessage (BoardCreatedMessage event){
        rabbitTemplate.convertAndSend(topicExchange.getName(), "board.push.feed", event);
    }
}
