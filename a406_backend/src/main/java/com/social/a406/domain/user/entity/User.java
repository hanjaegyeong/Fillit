package com.social.a406.domain.user.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "app_user") // 테이블 이름 변경 : sql 예약어(user) 중복 방지
@EntityListeners(AuditingEntityListener.class) //날짜 자동 업데이트를 위한 애노테이션
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String loginId;
    private String password;
    private String name;
    private String nickname;
    private int age;
    private String email;
    private String profileImageUrl;
    private String introduction; //한 줄 소개

    private String socialDomain; //이후 ENUM으로 변경
    private String socialId; //소셜로그인 ID

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private boolean isDeleted; //계정 삭제 여부
}
