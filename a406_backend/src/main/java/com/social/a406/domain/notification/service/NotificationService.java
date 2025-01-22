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

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

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

        return notification;
    }

    public List<Notification> getNotifications(UserDetails userDetails, Long cursorId, Pageable pageable) {
        User user = userRepository.findByNickname(userDetails.getUsername()).orElse(null);

        if(user == null){
            throw new IllegalArgumentException("User not found");
        }

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
