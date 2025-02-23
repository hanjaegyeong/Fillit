package com.social.a406.domain.user.repository;

import com.social.a406.domain.user.entity.EmailVerifyCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EmailVerifyCodeRepository extends JpaRepository<EmailVerifyCode,Long> {
    @Query("""
            SELECT EXISTS (
                SELECT 1
                FROM EmailVerifyCode e
                JOIN e.user eu
                WHERE eu.id = :userId AND e.verifyCode = :verifyCode
                AND e.createdAt <= :nowTime
                AND e.expiredAt >= :nowTime)
            """)
    boolean findByUserId(String userId, String verifyCode, LocalDateTime nowTime);
}
