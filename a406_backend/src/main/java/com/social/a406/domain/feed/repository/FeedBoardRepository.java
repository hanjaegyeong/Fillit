package com.social.a406.domain.feed.repository;

import com.social.a406.domain.board.entity.Board;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FeedBoardRepository extends JpaRepository<Board, Long> {

    // 추천 게시물 조회: 관심사와 일치하며, 좋아요 수가 최소 0, 최근 7일 내에 생성된 게시물을 조회
    @Query("SELECT DISTINCT b FROM Board b " +
            "JOIN FETCH b.user u " +
            "JOIN com.social.a406.domain.interest.entity.UserInterest ui ON ui.user = u " +
            "WHERE ui.interest.Id = :interestId " +
            "AND b.likeCount >= :minLikes " +
            "AND b.createdAt >= :limitTime " +
            "ORDER BY b.createdAt DESC")
    List<Board> findRecommendedBoards(@Param("interestId") Long interestId,
                                      @Param("minLikes") Integer minLikes,
                                      @Param("limitTime") LocalDateTime limitTime,
                                      Pageable pageable);
}