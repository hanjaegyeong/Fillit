package com.social.a406.domain.feed.entity;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "feeds")
@Getter
@NoArgsConstructor
public class Feed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    private Boolean isRecommended = false;

    private LocalDateTime addedAt;

    @Builder
    public Feed(User user, Board board, Boolean isRecommended, LocalDateTime addedAt) {
        this.user = user;
        this.board = board;
        this.isRecommended = isRecommended;
        this.addedAt = addedAt;
    }

    public void updateFeed(Board board, LocalDateTime addedAt) {
        this.board = board;
        this.addedAt = addedAt;
    }
}
