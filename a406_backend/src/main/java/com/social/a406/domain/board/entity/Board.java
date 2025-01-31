package com.social.a406.domain.board.entity;

import com.social.a406.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 2000)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Long likeCount = 0L;

//    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true)
//    private List<Comment> comments = new ArrayList<>();

    // x 좌표
    @Column(nullable = false)
    private Double x;

    // y 좌표
    @Column(nullable = false)
    private Double y;

    // z좌표
    @Column(nullable = false)
    private Integer z;

    // 키워드 (최대 8자 제한)
    @Column(length = 8)
    private String keyword;

    // 페이지 번호
    @Column(nullable = false)
    private Integer pageNumber;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private boolean isDeleted;

    @Builder
    public Board(String content, User user, Long likeCount, Double x, Double y, Integer z, String keyword, Integer pageNumber) {
        this.content = content;
        this.user = user;
        this.likeCount = likeCount == null ? 0L : likeCount;
        this.x = x;
        this.y = y;
        this.z = (z != null) ? z : 0;
        this.keyword = keyword;
        this.pageNumber = pageNumber;
    }

    public void updateContent(String content) {
        this.content = content;
    }

    // 좋아요 증가
    public void increaseLikeCount() {
        this.likeCount++;
    }

    // 좋아요 감소
    public void decreaseLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }
}
