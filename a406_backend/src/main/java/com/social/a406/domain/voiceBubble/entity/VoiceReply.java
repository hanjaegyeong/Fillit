package com.social.a406.domain.voiceBubble.entity;

import com.social.a406.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class VoiceReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voiceReplyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voice_voice_id", nullable = false)
    private Voice voice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String audioUrl;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public VoiceReply(Voice voice, User user, String audioUrl){
        this.voice = voice;
        this.user = user;
        this.audioUrl = audioUrl;
    }

}
