package com.social.a406.domain.user.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "emailverifycode")
@Getter
@NoArgsConstructor
public class EmailVerifyCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_email_verify_code_user"), nullable = false)
    private User user;

    @Column(nullable = false)
    private String verifyCode;

    @CreatedDate
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiredAt;

    @Builder
    private EmailVerifyCode(User user, String verifyCode) {
        this.user = user;
        this.verifyCode = verifyCode;
    }

    // @PrePersist를 사용하여 객체가 DB에 저장되기 전에 expiredAt을 설정
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();  // createdAt이 null일 경우 현재 시간으로 설정
        }
        this.expiredAt = this.createdAt.plusMinutes(5);  // expiredAt을 createdAt + 5분으로 설정
    }
}
