package com.social.a406.messaging.chat.consumer;

import com.social.a406.domain.ai.service.AIChatService;
import com.social.a406.messaging.chat.dto.AiChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AiChatCreatedConsumer {
    private final AIChatService aiChatService;

    @RabbitListener(queues = "chat.ai.created",  concurrency = "3")
    public void createAiChatMessage(AiChatMessage event){
        System.out.println("Ai Chat Event is published");
        aiChatService.processAiMessage(event.getAiPersonalId(), event.getMainPrompt(), event.getOtherUserName(), event.getChatMessageRequest());
    }

}
