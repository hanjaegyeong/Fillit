package com.social.a406.domain.feed.entity;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "feeds")
@Getter
@NoArgsConstructor
public class Feed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Board board;

    private Boolean isRecommended = false;

    private LocalDateTime createdAt;

    @Builder
    public Feed(User user, Board board, Boolean isRecommended, LocalDateTime createdAt) {
        this.user = user;
        this.board = board;
        this.isRecommended = isRecommended;
        this.createdAt = createdAt;
    }

}
