package com.social.a406.domain.commentReply.repository;

import com.social.a406.domain.commentReply.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Long> {

    List<Reply> findByComment_IdOrderByCreatedAtAsc(Long commentId);

    Long countByComment_Id(Long commentId);
}
