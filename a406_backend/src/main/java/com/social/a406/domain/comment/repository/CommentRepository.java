package com.social.a406.domain.comment.repository;

import com.social.a406.domain.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBoard_IdOrderByCreatedAtAsc(Long boardId); //댓글 오래된순으로 조회
}
