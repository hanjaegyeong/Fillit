package com.social.a406.domain.user.entity;

import com.social.a406.domain.ai.entity.UserSubredditMapping;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "app_user") // 테이블 이름 변경 : sql 예약어(user) 중복 방지
@EntityListeners(AuditingEntityListener.class) // 날짜 자동 업데이트를 위한 애노테이션
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false, unique = true)
    private String id; // UUID를 PK로 사용

    private String email; //생성형 AI의 경우 null

    private String password; //생성형 AI의 경우 null

    private String name; // 찢어진 종이로 표시되는 유저 이름

    @Column(nullable = false, unique = true)
    private String personalId; // @뒤에 들어가는 유저id, null 불가 && 중복 불가

    @Column(name = "birth_date")
    @Temporal(TemporalType.DATE)
    private Date birthDate; // 생년월일

    private String profileImageUrl;
    private String introduction; // 한 줄 소개

    private String socialDomain; // 이후 ENUM으로 변경
    private String socialId; // 소셜로그인 ID

    @Column(nullable = true, columnDefinition = "TEXT")
    private String mainPrompt; // 생성형 AI 메인 프롬프트

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserSubredditMapping> userSubredditMappings = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private boolean isDeleted; // 계정 삭제 여부

    @Builder
    public User(String password, String name, String personalId, Date birthDate, String email, String profileImageUrl,
                String introduction, String socialDomain, String socialId, boolean isDeleted) {
        this.password = password;
        this.name = name;
        this.personalId = personalId;
        this.birthDate = birthDate;
        this.email = email;
        this.profileImageUrl = profileImageUrl;
        this.introduction = introduction;
        this.socialDomain = socialDomain;
        this.socialId = socialId;
        this.isDeleted = isDeleted;
    }

    public void updatePassword(String password) {
        this.password = password;
    }
}