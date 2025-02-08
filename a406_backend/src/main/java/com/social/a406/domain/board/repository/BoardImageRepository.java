package com.social.a406.domain.board.repository;

import com.social.a406.domain.board.entity.BoardImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
    @Query("SELECT i.imageUrl FROM BoardImage i WHERE i.board.id = :id")
    List<String> findAllById(@Param("id") Long boardId);

    @Modifying
    @Query("DELETE FROM BoardImage bi WHERE bi.board.id = :id")
    void deleteByBoardId(@Param("id") Long boardId);

    Optional<BoardImage> findFirstByBoardIdOrderByIdAsc(Long boardId);

}
