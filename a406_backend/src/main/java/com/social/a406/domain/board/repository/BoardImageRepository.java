package com.social.a406.domain.board.repository;

import com.social.a406.domain.board.entity.BoardImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
    @Query("SELECT i.imageUrl FROM BoardImage i WHERE i.board.boardId = :boardId")
    List<String> findAllByBoardId(@Param("boardId") Long boardId);

    @Modifying
    @Query("DELETE FROM BoardImage bi WHERE bi.board.boardId = :boardId")
    void deleteByBoardId(@Param("boardId") Long boardId);
}
