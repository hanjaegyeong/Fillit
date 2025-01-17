package com.social.a406.domain.character.repository;

import com.social.a406.domain.character.entity.Character;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CharacterRepository extends JpaRepository<Character, Long> {
    Optional<Character> findByNickname(String nickname);
}
