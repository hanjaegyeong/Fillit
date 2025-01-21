package com.social.a406.domain.hotissue.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
@Table(name = "categories_youtube")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int categoryId; // categoryId 값

    // 생성자
    @Builder
    public Category(String name, int categoryId) {
        this.name = name;
        this.categoryId = categoryId;
    }
}
