package com.social.a406.domain.subreddit.service;

import com.social.a406.domain.subreddit.dto.SubredditDTO;
import com.social.a406.domain.subreddit.entity.Subreddit;
import com.social.a406.domain.subreddit.entity.UserSubredditMapping;
import com.social.a406.domain.subreddit.repository.UserSubredditMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SubredditService {

    private final UserSubredditMappingRepository userSubredditMappingRepository;

    public Subreddit getRandomUserSubreddit() {
        // 매핑 관계가 있는 모든 User-Subreddit 가져오기
        List<UserSubredditMapping> mappings = userSubredditMappingRepository.findAll();

        if (mappings.isEmpty()) {
            throw new IllegalStateException("No users with subreddit mappings found.");
        }

        // 랜덤하게 하나의 매핑 선택
        UserSubredditMapping randomMapping = getRandomElement(mappings);

        // 선택된 Subreddit 반환
        return randomMapping.getSubreddit();
    }

    public SubredditDTO toDTO(Subreddit subreddit) {
        if (subreddit == null) {
            throw new IllegalArgumentException("Subreddit cannot be null.");
        }

        return SubredditDTO.builder()
                .id(subreddit.getId())
                .name(subreddit.getName())
                .content(subreddit.getContent())
                .build();
    }

    private <T> T getRandomElement(List<T> list) {
        Random random = new Random();
        return list.get(random.nextInt(list.size()));
    }
}
