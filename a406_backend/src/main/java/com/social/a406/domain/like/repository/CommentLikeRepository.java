package com.social.a406.domain.like.repository;

import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.like.entity.CommentLike;
import com.social.a406.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    boolean existsByUserAndComment(User user, Comment comment);
}