package com.social.a406.domain.voiceBubble.repository;

import com.social.a406.domain.voiceBubble.entity.Voice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoiceRepository extends JpaRepository<Voice, Long> {
    Optional<Voice> findByUserPersonalId(String personalId);
    List<Voice> findAllByUser_IdInOrderByCreatedAtDesc(List<String> userIds);
}
