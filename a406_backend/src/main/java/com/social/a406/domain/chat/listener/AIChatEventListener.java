package com.social.a406.domain.chat.listener;

import com.social.a406.domain.ai.service.AIChatService;
import com.social.a406.domain.chat.event.AIChatMessageEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AIChatEventListener {

    private final AIChatService aiChatService;

    @Async
    @EventListener
    public void handleAiChatMessage(AIChatMessageEvent event) {
        aiChatService.processAiMessage(event.getAiUser(), event.getChatMessageRequest());
    }
}
