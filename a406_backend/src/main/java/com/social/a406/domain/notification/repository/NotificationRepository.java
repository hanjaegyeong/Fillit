package com.social.a406.domain.notification.repository;

import com.social.a406.domain.notification.entity.Notification;
import com.social.a406.domain.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Long> {
    @Query("SELECT n FROM Notification n WHERE n.receiver = :user AND n.isRead = false AND n.id < :cursorId ORDER BY n.id DESC")
    List<Notification> findAllByReceiverAndIsReadFalse(User user, Long cursorId, Pageable pageable);

    Optional<Notification> findById(Long id);
}
