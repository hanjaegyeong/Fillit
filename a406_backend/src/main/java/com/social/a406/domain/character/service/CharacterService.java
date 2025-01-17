package com.social.a406.domain.character.service;

import com.social.a406.domain.character.entity.Character;
import com.social.a406.domain.character.repository.CharacterRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CharacterService {

    private final CharacterRepository characterRepository;

    public CharacterService(CharacterRepository characterRepository) {
        this.characterRepository = characterRepository;
    }

    public Optional<Character> findByNickname(String nickname) {
        return characterRepository.findByNickname(nickname);
    }
}
