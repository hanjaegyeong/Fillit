package com.social.a406.domain.board.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class BoardImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardImageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_board_id", foreignKey = @ForeignKey(name = "fk_board_image_board"), nullable = false)
    private Board board;

    @Column(nullable = false)
    private String imageUrl;

    @Builder
    private BoardImage(
            Board board,
            String imageUrl
    ) {
        this.board = board;
        this.imageUrl = imageUrl;
    }
}
