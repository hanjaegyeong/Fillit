package com.social.a406.domain.ai.repository;

import com.social.a406.domain.ai.entity.YoutubeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface YoutubeCategoryRepository extends JpaRepository<YoutubeCategory, Long> {
    // categoryId로 카테고리 찾기
    YoutubeCategory findByCategoryId(Integer categoryId);
}