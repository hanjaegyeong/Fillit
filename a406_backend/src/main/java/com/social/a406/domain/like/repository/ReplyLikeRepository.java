package com.social.a406.domain.like.repository;


import com.social.a406.domain.commentReply.entity.Reply;
import com.social.a406.domain.like.entity.ReplyLike;
import com.social.a406.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReplyLikeRepository extends JpaRepository<ReplyLike, Long> {
    boolean existsByUserAndReply(User user, Reply reply);

    Optional<ReplyLike> findByUserAndReply(User user, Reply reply);

    List<ReplyLike> findByReply(Reply reply);
}