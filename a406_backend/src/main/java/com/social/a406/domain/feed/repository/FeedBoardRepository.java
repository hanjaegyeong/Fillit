package com.social.a406.domain.feed.repository;

import com.social.a406.domain.board.entity.Board;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FeedBoardRepository extends JpaRepository<Board, Long> {

//    // 친구(팔로우한 사용자) 게시물 조회
//    @Query("SELECT b FROM Board b WHERE b.user.Id IN :followedUserIds AND b.createdAt < :cursor ORDER BY b.createdAt DESC")
//    List<Board> findFollowedBoards(@Param("followedUserIds") List<Long> followedUserIds,
//                                   @Param("cursor") LocalDateTime cursor,
//                                   Pageable pageable);

    // 추천 게시물 조회: 관심사와 일치하며, 좋아요 수가 최소 10, 최근 3일 내에 생성된 게시물을 조회
    @Query("SELECT DISTINCT b FROM Board b " +
            "JOIN b.user u " +
            "JOIN com.social.a406.domain.interest.entity.UserInterest ui ON ui.user = u " +
            "WHERE ui.interest.Id = :interestId " +
            "AND b.likeCount >= :minLikes " +
            "AND b.createdAt >= :threeDaysAgo " +
            "ORDER BY b.createdAt DESC")
    List<Board> findRecommendedBoards(@Param("interestId") Long interestId,
                                      @Param("minLikes") Integer minLikes,
                                      @Param("threeDaysAgo") LocalDateTime threeDaysAgo,
                                      Pageable pageable);
}