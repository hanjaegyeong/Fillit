package com.social.a406.domain.character.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "characters")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Character {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false, unique = true, columnDefinition = "CHAR(36) DEFAULT (UUID())")
    private String id;

    private String name;

    @Column(nullable = false, length = 50)
    private String nickname; // 닉네임

    @Column(name = "profile_image_url", length = 255)
    private String profileImageUrl; // 프로필 이미지 URL

    @Column(name = "birth_date")
    @Temporal(TemporalType.DATE)
    private Date birthDate; // 생년월일

    @Column(columnDefinition = "TEXT")
    private String introduction; // 소개문구

    @Column(name = "main_prompt", nullable = false, columnDefinition = "TEXT")
    private String mainPrompt; // 메인 프롬프트

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성 시간

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 수정 시간

    @Builder
    public Character(String nickname, String profileImageUrl, Date birthDate, String introduction, String mainPrompt) {
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.birthDate = birthDate;
        this.introduction = introduction;
        this.mainPrompt = mainPrompt;
        this.createdAt = LocalDateTime.now(); // 생성 시간 기본값
    }
}
