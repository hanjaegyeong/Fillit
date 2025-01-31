package  com.social.a406.domain.follow.entity;

import jakarta.persistence.*;

import  com.social.a406.domain.user.entity.User;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "app_follow")
@EntityListeners(AuditingEntityListener.class) //날짜 자동 업데이트를 위한 애노테이션

public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long followId;

    // 팔로우 건 사용자
    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    // 팔로우 당한 사용자
    @ManyToOne
    @JoinColumn(name = "followee_id", nullable = false)
    private User followee;

    @CreatedDate
    private LocalDateTime createdAt;




}
