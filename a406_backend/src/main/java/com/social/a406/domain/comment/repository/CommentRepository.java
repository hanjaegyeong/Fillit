package com.social.a406.domain.comment.repository;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoard_IdOrderByCreatedAtAsc(Long boardId); //댓글 오래된순으로 조회
    long countByBoard_Id(Long boardId);

    Long board(Board board);
}
