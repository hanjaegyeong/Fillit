package com.social.a406.domain.feed.repository;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.feed.entity.Feed;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FeedRepository extends JpaRepository<Feed, Long> {

    @Query(
            value = "SELECT f FROM Feed f WHERE f.user.id = :userId AND  f.board.createdAt < :cursor ORDER BY f.board.createdAt DESC",
            countQuery = "SELECT COUNT(f) FROM Feed f WHERE f.user.id = :userId AND f.board.createdAt < :cursor"
    )
    List<Feed> findByUserIdAndCreatedAtAfter(@Param("userId") String userId,
                                             @Param("cursor") LocalDateTime cursor,
                                             Pageable pageable);



    List<Feed> findByBoard(Board board);


    @Modifying
    @Query("DELETE FROM Feed f WHERE f.user.id = :userId AND f.board IN :boardList")
    void deleteByUserAndBoardIn(@Param("userId") String userId, @Param("boardList") List<Board> boardList);



}
