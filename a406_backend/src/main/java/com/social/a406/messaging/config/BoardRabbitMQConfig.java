package com.social.a406.messaging.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BoardRabbitMQConfig {

    @Bean
    public Queue boardPushToFeedQueue(){
        return new Queue("board.push.feed", true);
    }

    @Bean
    public Binding boardPushToFeedBinding(Queue boardPushToFeedQueue, TopicExchange topicExchange){
        return BindingBuilder
                .bind(boardPushToFeedQueue)
                .to(topicExchange)
                .with("board.*.feed");
    }
}
