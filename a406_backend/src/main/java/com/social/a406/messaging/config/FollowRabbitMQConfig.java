package com.social.a406.messaging.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FollowRabbitMQConfig {

    @Bean
    public Queue followPushToFeedQueue() {
        return new Queue("follow.push.feed", true);
    }

    @Bean
    public Queue unfollowDeleteFeedQueue(){
        return new Queue("unfollow.delete.feed", true);
    }

    @Bean
    public Binding followPushToFeedBinding(Queue followPushToFeedQueue, TopicExchange topicExchange) {
        return BindingBuilder
                .bind(followPushToFeedQueue)
                .to(topicExchange)
                .with("follow.push.*");
    }

    @Bean
    public Binding unfollowDeleteFeedBinding(Queue unfollowDeleteFeedQueue, TopicExchange topicExchange){
        return BindingBuilder
                .bind(unfollowDeleteFeedQueue)
                .to(topicExchange)
                .with("unfollow.delete.*");
    }

}
