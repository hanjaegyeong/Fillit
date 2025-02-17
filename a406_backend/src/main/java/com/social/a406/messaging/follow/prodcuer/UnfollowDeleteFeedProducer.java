package com.social.a406.messaging.follow.prodcuer;

import com.social.a406.messaging.follow.dto.FollowMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UnfollowDeleteFeedProducer {
    private final RabbitTemplate rabbitTemplate;
    private final TopicExchange topicExchange;

    public void sendUnfollowCreatedMessage(FollowMessage event){
        rabbitTemplate.convertAndSend(topicExchange.getName(), "unfollow.delete.feed", event);
    }
}
