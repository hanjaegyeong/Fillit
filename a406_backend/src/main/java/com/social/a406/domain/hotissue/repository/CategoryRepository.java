package com.social.a406.domain.hotissue.repository;

import com.social.a406.domain.hotissue.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // categoryId로 카테고리 찾기
    Category findByCategoryId(Integer categoryId);
}