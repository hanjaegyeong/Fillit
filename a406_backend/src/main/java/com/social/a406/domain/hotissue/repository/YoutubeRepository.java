package com.social.a406.domain.hotissue.repository;

import com.social.a406.domain.hotissue.entity.Youtube;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YoutubeRepository extends JpaRepository<Youtube, Long> {
    Youtube getYoutubeById(Long id);
}
