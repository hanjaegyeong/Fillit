package com.social.a406.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange("exchange.topic");
    }

    // 1. 채팅 관련 Queue 및 Binding
    @Bean
    public Queue chatRoomUpdateQueue() {
        return new Queue("chat.room.update", true);
    }

    @Bean
    public Queue chatDbSaveQueue() {
        return new Queue("chat.db.save", true);
    }

    @Bean
    public Binding chatRoomUpdateBinding(Queue chatNotificationQueue, TopicExchange topicExchange) {
        // 채팅 메시지 알림: "chat.message.created" 등 패턴 매칭
        return BindingBuilder
                .bind(chatNotificationQueue)
                .to(topicExchange)
                .with("chat.room.*");
    }

    @Bean
    public Binding chatDbSaveBinding(Queue chatDbUpdateQueue, TopicExchange topicExchange) {
        return BindingBuilder
                .bind(chatDbUpdateQueue)
                .to(topicExchange)
                .with("chat.db.*");
    }



    /**
     * Config 기본설정들
     */
    @Bean
    MessageConverter messageConverter() {
//        return new SimpleMessageConverter(); //  Publish된 데이터를 추가적인 인코딩이나 변조 없이 Publish
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
