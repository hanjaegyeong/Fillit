package com.social.a406.domain.voiceBubble.repository;

import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.voiceBubble.entity.Voice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoiceRepository extends JpaRepository<Voice, Long> {
    List<Voice> findAllByUserPersonalId(String personalId);
    Optional<Voice> findByUserPersonalId(String personalId);
    Optional<Voice> findById(Long voiceId);
    List<Voice> findAllByUserIdInOrderByCreatedAtDesc(List<User> users);
}
