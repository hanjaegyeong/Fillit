package com.social.a406.domain.comment.repository;

import com.social.a406.domain.comment.entity.Comment;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("""
    SELECT c, 
           CASE WHEN cl.id IS NOT NULL THEN true ELSE false END AS isLiked
    FROM Comment c
    LEFT JOIN CommentLike cl ON cl.comment.id = c.id AND cl.user.personalId = :personalId
    WHERE c.board.id = :boardId
    ORDER BY c.createdAt ASC
""")
    List<Object[]> findCommentsWithLikeStatusByBoardId(
            @Param("personalId") String personalId,
            @Param("boardId") Long boardId);//댓글 오래된순으로 조회

    @Query("""
    SELECT c AS comment, 
           CASE WHEN cl.id IS NOT NULL THEN true ELSE false END AS isLiked
    FROM Comment c
    LEFT JOIN CommentLike cl ON cl.comment.id = c.id AND cl.user.personalId = :personalId
    WHERE c.id = :commentId
""")
    Tuple getCommentWithLikeStatus(@Param("commentId") Long commentId, @Param("personalId") String personalId);


    long countByBoard_Id(Long boardId);
}
