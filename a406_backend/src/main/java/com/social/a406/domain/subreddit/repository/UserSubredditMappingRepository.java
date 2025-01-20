package com.social.a406.domain.subreddit.repository;

import com.social.a406.domain.subreddit.entity.UserSubredditMapping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSubredditMappingRepository extends JpaRepository<UserSubredditMapping, Long> {
}
