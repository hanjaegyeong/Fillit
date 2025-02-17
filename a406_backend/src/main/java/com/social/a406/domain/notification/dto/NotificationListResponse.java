package com.social.a406.domain.notification.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class NotificationListResponse {
    private Long cursorId;
    private List<NotificationResponse> responses;
}
