package com.social.a406.domain.board.repository;

import com.social.a406.domain.board.entity.Board;
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

    //단어 검색
    @Query(value = "SELECT * FROM board " +
            "WHERE MATCH(content, keyword) AGAINST(:word IN BOOLEAN MODE) " +
            "AND (:cursorId IS NULL OR board.board_id < :cursorId) " +
            "ORDER BY board.board_id DESC",
            nativeQuery = true)
    List<Board> searchBoard(@Param("word") String word,
                            @Param("cursorId") Long cursorId,
                            Pageable pageable);

    //부분 문자열 검색 가능
//    @Query(value = "SELECT * FROM board " +
//            "WHERE (content LIKE %:word% OR keyword LIKE %:word%) " +
//            "AND (:cursorId IS NULL OR board.board_id < :cursorId) " +
//            "ORDER BY board.board_id DESC",
//            nativeQuery = true)
//    List<Board> searchBoard(@Param("word") String word,
//                            @Param("cursorId") Long cursorId,
//                            Pageable pageable);

}
