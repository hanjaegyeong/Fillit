package com.social.a406.domain.feed.repository;

import com.social.a406.domain.board.entity.Board;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    // 팔로우 게시물 조회
    @Query("SELECT b FROM Board b WHERE b.user.userId IN :followedUserIds AND b.createdAt < :cursor ORDER BY b.createdAt DESC")
    List<Board> findFollowedBoards(@Param("followedUserIds") List<Long> followedUserIds,
                                   @Param("cursor") LocalDateTime cursor,
                                   Pageable pageable);

    // 추천 게시물 조회 (관심사 기반)
    @Query("SELECT DISTINCT b FROM Board b JOIN b.user u JOIN UserInterest ui ON u.userId = ui.user.userId " +
            "JOIN ui.interest i WHERE i.content = :interest " +
            "AND b.likeCount >= :minLikes AND b.createdAt >= :threeDaysAgo ORDER BY b.createdAt DESC")
    List<Board> findRecommendedBoards(@Param("interest") String interest,
                                      @Param("minLikes") Integer minLikes,
                                      @Param("threeDaysAgo") LocalDateTime threeDaysAgo,
                                      Pageable pageable);
}
