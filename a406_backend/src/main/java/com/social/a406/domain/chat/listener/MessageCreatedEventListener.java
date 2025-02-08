package com.social.a406.domain.chat.listener;

import com.social.a406.domain.chat.event.MessageCreatedEvent;
import com.social.a406.domain.chat.event.UnreadMessageEvent;
import com.social.a406.domain.chat.service.ChatWebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageCreatedEventListener  {
    private final ChatWebSocketService chatWebSocketService;

    @Async
    @EventListener
    public void handleCreateMessageEvent(MessageCreatedEvent event) {
        chatWebSocketService.saveMessage(event.getPersonalId(), event.getChatMessageRequest());
    }

    @Async
    @EventListener
    public void handleUnreadMessageEvent(UnreadMessageEvent event) {
        chatWebSocketService.increaseUnreadMessageAndUpdateRoom(event.getRequest(), event.getPersonalIdList());
    }

}
