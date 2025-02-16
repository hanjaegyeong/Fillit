package com.social.a406.domain.voiceBubble.repository;

import com.social.a406.domain.voiceBubble.entity.Voice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VoiceRepository extends JpaRepository<Voice, Long> {
    Optional<Voice> findByUserPersonalId(String personalId);
    @Query("""
    SELECT v FROM Voice v 
    WHERE v.user.id IN :userIds 
    AND NOT EXISTS (
        SELECT 1 FROM VoiceListen vl 
        WHERE vl.voice = v 
        AND vl.user.id = :myUserId
    )
    ORDER BY v.createdAt DESC
""")
    List<Voice> findAllByUser_IdInAndNotListened(
            @Param("userIds") List<String> userIds,
            @Param("myUserId") String myUserId
    );
}
