package com.social.a406.domain.notification.dto;

import com.social.a406.domain.notification.entity.Notification;
import com.social.a406.domain.notification.entity.NotificationType;

public record NotificationResponse(
        String receiverNickname,
        String SenderNickname,
        NotificationType type,
        Long referenceId
) {
    public NotificationResponse(Notification notification){
        this(notification.getReceiver().getPersonalId(),
                notification.getSender().getPersonalId(),
                notification.getType(),
                notification.getReferenceId());
    }
}
