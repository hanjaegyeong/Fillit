package com.social.a406.domain.board.repository;

import com.social.a406.domain.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
    //comment 쓰는 버전
//    @Query("SELECT b, COUNT(c) as commentCount " +
//            "FROM Board b " +
//            "LEFT JOIN Comment c ON c.board = b " +
//            "GROUP BY b")
//    List<Object[]> findAllBoardsWithCommentCount();
}
