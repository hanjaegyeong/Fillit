package com.social.a406.domain.notification.controller;


import com.social.a406.domain.notification.dto.NotificationListResponse;
import com.social.a406.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

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
    public ResponseEntity<NotificationListResponse> getNotifications(@AuthenticationPrincipal UserDetails userDetails,
                                                                     @RequestParam(defaultValue = "10") int size,
                                                                     @RequestParam(required = false) Long cursorId) {
        Pageable pageable = PageRequest.of(0, size);
        NotificationListResponse response = notificationService.getNotifications(userDetails, cursorId, pageable);

        return ResponseEntity.ok(response);
    }

    // 읽음 처리
    @PostMapping("/{notificationId}/read")
    public ResponseEntity<String> readNotification(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long notificationId){
        notificationService.readNotification(userDetails.getUsername(), notificationId);
        return ResponseEntity.ok("success to read processing");
    }

}
