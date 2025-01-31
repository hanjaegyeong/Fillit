package com.social.a406.domain.board.repository;

import com.social.a406.domain.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {
    //comment 쓰는 버전
//    @Query("SELECT b, COUNT(c) as commentCount " +
//            "FROM Board b " +
//            "LEFT JOIN Comment c ON c.board = b " +
//            "GROUP BY b")
//    List<Object[]> findAllBoardsWithCommentCount();
    @Query("SELECT b.id FROM Board b")
    List<Long> findAllBoardIds();

    // 해당 사용자가 댓글을 달거나, 해당 사용자의 게시글이 아닌 게시글 조회
    @Query("SELECT b.id " +
            "FROM Board b " +
            "WHERE b.id NOT IN (SELECT c.board.id FROM Comment c WHERE c.user.personalId = :personalId) " +
            "AND b.user.personalId != :personalId")
    List<Long> findAvailableBoardIdsExcludingUser(@Param("personalId") String personalId);

    @Query("SELECT b FROM Board b WHERE b.user.personalId = :personalId")
    List<Board> findAllByPersonalId(@Param("personalId") String personalId);
}
