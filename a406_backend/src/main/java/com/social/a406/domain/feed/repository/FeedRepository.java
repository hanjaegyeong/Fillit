package com.social.a406.domain.feed.repository;

import com.social.a406.domain.feed.entity.Feed;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FeedRepository extends JpaRepository<Feed, Long> {

    @Query("SELECT f FROM Feed f WHERE f.user.userId = :userId AND f.addedAt < :cursor ORDER BY f.addedAt DESC")
    List<Feed> findByUserIdAndAddedAtBefore(@Param("userId") Long userId,
                                            @Param("cursor") LocalDateTime cursor,
                                            Pageable pageable);
}