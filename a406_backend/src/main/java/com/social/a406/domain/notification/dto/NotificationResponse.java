package com.social.a406.domain.notification.dto;

import com.social.a406.domain.notification.entity.Notification;
import com.social.a406.domain.notification.entity.NotificationType;

public record NotificationResponse(
        String receiverPersonalId,
        String SenderPersonalId,
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
