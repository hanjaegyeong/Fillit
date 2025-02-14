package com.social.a406.domain.board.repository;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    //comment 쓰는 버전
//    @Query("SELECT b, COUNT(c) as commentCount " +
//            "FROM Board b " +
//            "LEFT JOIN Comment c ON c.board = b " +
//            "GROUP BY b")
//    List<Object[]> findAllBoardsWithCommentCount();
    @Query("SELECT b.id FROM Board b")
    List<Long> findAllIds();

    // 해당 사용자가 댓글을 달거나, 해당 사용자의 게시글이 아닌 게시글 조회
    @Query("SELECT b.id " +
            "FROM Board b " +
            "WHERE b.id NOT IN (SELECT c.board.id FROM Comment c WHERE c.user.personalId = :personalId) " +
            "AND b.user.personalId != :personalId")
    List<Long> findAvailableIdsExcludingUser(@Param("personalId") String personalId);

    @Query("SELECT b FROM Board b WHERE b.user.personalId = :personalId")
    List<Board> findAllByPersonalId(@Param("personalId") String personalId);

    @Query("""
    SELECT b, 
           CASE WHEN bl.id IS NOT NULL THEN true ELSE false END AS liked
    FROM Board b 
    LEFT JOIN BoardLike bl ON b.id = bl.board.id AND bl.user.personalId = :myPersonalId
    WHERE b.user.personalId = :personalId
    """)
    List<Object[]> findAllByPersonalIdWithLike(
            @Param("personalId") String personalId,
            @Param("myPersonalId") String myPersonalId
    );

    List<Board> findByUser(User otherUser);

    @Query("""
    SELECT b, 
           (SELECT bi.imageUrl 
            FROM BoardImage bi 
            WHERE bi.board = b 
            ORDER BY bi.id ASC 
            LIMIT 1),
           CASE 
               WHEN bl.id IS NOT NULL THEN true 
               ELSE false 
           END 
    FROM BoardInterest bi
    JOIN bi.board b
    LEFT JOIN BoardLike bl 
           ON bl.board = b AND bl.user.id = :userId
    WHERE bi.interest.id = :interestId 
      AND (
          (:cursorLikeCount IS NULL AND :cursorId IS NULL) 
          OR (b.likeCount < :cursorLikeCount) 
          OR (b.likeCount = :cursorLikeCount AND b.id < :cursorId)
      )
    ORDER BY b.likeCount DESC, b.id DESC
""")
    List<Object[]> findBoardsWithFirstImageAndLikeStatusByInterestId(
            @Param("interestId") Long interestId,
            @Param("userId") String userId,
            @Param("cursorLikeCount") Long cursorLikeCount,
            @Param("cursorId") Long cursorId,
            Pageable pageable
    );

    //부분 문자열 검색 가능
    @Query("""
    SELECT b, 
           CASE WHEN bl.id IS NOT NULL THEN true ELSE false END
    FROM Board b
    LEFT JOIN BoardLike bl
           ON bl.board.id = b.id AND bl.user.id = :userId
    WHERE (b.content LIKE %:word% OR b.keyword LIKE %:word%)
    AND (:cursorId IS NULL OR b.id < :cursorId)
    ORDER BY b.id DESC
""")
    List<Object[]> searchBoardWithLikeStatus(
            @Param("word") String word,
            @Param("cursorId") Long cursorId,
            @Param("userId") String userId,
            Pageable pageable
    );
}
