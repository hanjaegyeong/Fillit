package com.social.a406.domain.notification.controller;


import com.social.a406.domain.notification.dto.NotificationResponse;
import com.social.a406.domain.notification.entity.Notification;
import com.social.a406.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    //SSE 구독
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@RequestParam String personalId){ // RequestParam : test용 (로그인 구현 후 AuthenticationPrincipal으로 변경)
        return notificationService.subscribe(personalId);
    }

    // 조회
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(@AuthenticationPrincipal UserDetails userDetails,
                                                                           @RequestParam(defaultValue = "10") int size,
                                                                           @RequestParam(required = false, defaultValue = "0") Long cursorId) {
        Pageable pageable = PageRequest.of(0, size);
        List<Notification> notifications = notificationService.getNotifications(userDetails, cursorId, pageable);

        List<NotificationResponse> responseList = notifications.stream()
                .map(NotificationResponse::new)  // Notification 엔티티를 NotificationResponse로 변환
                .toList();

        return ResponseEntity.ok(responseList);
    }

    // 읽음 처리
    @PostMapping("/{notificationId}/read")
    public ResponseEntity<String> readNotification(@PathVariable Long notificationId){
        notificationService.readNotification(notificationId);
        return ResponseEntity.ok("success to read processing");
    }

}
