package com.social.a406.domain.notification.entity;


import com.social.a406.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@EntityListeners(AuditingEntityListener.class)
@Table(name = "notifications")
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User sender;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private Long referenceId;
    private boolean isRead;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public Notification(User receiver,
                        User sender,
                        NotificationType type,
                        Long referenceId) {
        this.receiver = receiver;
        this.sender = sender;
        this.type = NotificationType.valueOf(type.name().toUpperCase());
        this.referenceId = referenceId;
        this.isRead = false;
    }

    public void readNotification(){
        isRead = true;
    }
}
