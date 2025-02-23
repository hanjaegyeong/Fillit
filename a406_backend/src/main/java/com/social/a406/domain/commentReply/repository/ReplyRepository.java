package com.social.a406.domain.commentReply.repository;

import com.social.a406.domain.commentReply.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Long> {

    List<Reply> findByComment_IdOrderByCreatedAtAsc(Long commentId);

    Long countByComment_Id(Long commentId);

    void deleteAllByComment_Id(Long commentId);

    @Query("""
        SELECT r, 
               CASE WHEN rl.id IS NOT NULL THEN true ELSE false END AS isLiked
        FROM Reply r
        LEFT JOIN ReplyLike rl ON rl.reply.id = r.id AND rl.user.personalId = :personalId
        WHERE r.comment.id = :commentId
        ORDER BY r.createdAt ASC
    """)
    List<Object[]> findRepliesWithLikeStatus(@Param("commentId") Long commentId,
                                             @Param("personalId") String personalId);
}
