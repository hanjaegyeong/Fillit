package com.social.a406.domain.notification.service;

import com.social.a406.domain.notification.entity.Notification;
import com.social.a406.domain.notification.entity.NotificationType;
import com.social.a406.domain.notification.repository.NotificationRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private static final ConcurrentMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    private long TIME_OUT = 60 * 1000L; // 1분

    public SseEmitter subscribe(String personalId){

        SseEmitter emitter = new SseEmitter(TIME_OUT);
        emitters.put(personalId, emitter);  // emitters 맵에 사용자와 emitter 연결 저장
        // 연결 종료 시 emitter에서 사용자 제거
        emitter.onCompletion(() -> emitters.remove(personalId));
        // 타임아웃 발생 시 emitter에서 사용자 제거
        emitter.onTimeout(() -> emitters.remove(personalId));
        // 에러 발생 시 emitter에서 사용자 제거
        emitter.onError((e) -> emitters.remove(personalId));
        return emitter;
    }

    // 새로운 알림이 생기면 SSE로 사용자에게 전송
    public void notifyUser(String username) {
        SseEmitter emitter = emitters.get(username);
        if (emitter != null) {
            try {
                emitter.send("new_notification");
            } catch (IOException e) {
                emitters.remove(username);
            }
        }
    }

    public Notification createNotification(User receiver, User sender, NotificationType type, Long referenceId){
        if(receiver.equals(sender)){
            throw new IllegalArgumentException("You can't send yourself a notification");
        }

        Notification notification = Notification.builder()
                .receiver(receiver)
                .sender(sender)
                .type(type)
                .referenceId(referenceId)
                .build();

        notificationRepository.save(notification);

        notifyUser(receiver.getPersonalId());

        return notification;
    }

    public List<Notification> getNotifications(UserDetails userDetails, Long cursorId, Pageable pageable) {
        User user = userRepository.findByPersonalId(userDetails.getUsername()).orElseThrow(
                () -> new IllegalArgumentException("User Not found")
        );

        List<Notification> notifications = notificationRepository.findAllByReceiverAndIsReadFalse(user, cursorId, pageable);
        return notifications;
    }

    public void readNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);

        if(notification == null){
            throw new IllegalArgumentException("Notification not found");
        }

        notification.readNotification();
        notificationRepository.save(notification);

    }

}
