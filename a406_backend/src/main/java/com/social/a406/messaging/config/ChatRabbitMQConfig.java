package com.social.a406.messaging.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatRabbitMQConfig {

    // 1. 채팅 관련 Queue
    @Bean
    public Queue chatRoomUpdateQueue() {
        return new Queue("chat.room.update", true);
    }

    @Bean
    public Queue chatDbSaveQueue() {
        return new Queue("chat.db.save", true);
    }

    @Bean
    public Queue aiChatCreatedQueue() {
        return new Queue("chat.ai.created", true);
    }


    // 2. Binding
    @Bean
    public Binding chatRoomUpdateBinding(Queue chatRoomUpdateQueue, TopicExchange topicExchange) {
        // 채팅 메시지 알림: "chat.message.created" 등 패턴 매칭
        return BindingBuilder
                .bind(chatRoomUpdateQueue)
                .to(topicExchange)
                .with("chat.room.*");
    }

    @Bean
    public Binding chatDbSaveBinding(Queue chatDbSaveQueue, TopicExchange topicExchange) {
        return BindingBuilder
                .bind(chatDbSaveQueue)
                .to(topicExchange)
                .with("chat.db.*");
    }

    @Bean
    public Binding aiChatCreatedBinding(Queue aiChatCreatedQueue, TopicExchange topicExchange){
        return BindingBuilder
                .bind(aiChatCreatedQueue)
                .to(topicExchange)
                .with("chat.ai.*");
    }



}
