package com.social.a406.domain.ai.repository;

import com.social.a406.domain.ai.entity.UserSubredditMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSubredditMappingRepository extends JpaRepository<UserSubredditMapping, Long> {
    List<UserSubredditMapping> findByUser_Nickname(String nickname);
}
