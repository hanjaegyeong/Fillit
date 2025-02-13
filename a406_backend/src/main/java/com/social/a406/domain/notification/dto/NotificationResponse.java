package com.social.a406.domain.notification.dto;

import com.social.a406.domain.notification.entity.Notification;
import com.social.a406.domain.notification.entity.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long notificationId,
        String receiverPersonalId,
        String senderPersonalId,
        String senderProfileImageUrl,
        NotificationType type,
        Long referenceId,
        LocalDateTime createdAt,
        boolean isRead
) {
    public NotificationResponse(Notification notification){
        this(notification.getId(),
                notification.getReceiver().getPersonalId(),
                notification.getSender().getPersonalId(),
                notification.getSender().getProfileImageUrl(),
                notification.getType(),
                notification.getReferenceId(),
                notification.getCreatedAt(),
                notification.isRead()
                );
    }
}
