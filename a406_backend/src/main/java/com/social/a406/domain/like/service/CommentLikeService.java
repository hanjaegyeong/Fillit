package com.social.a406.domain.like.service;

import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.repository.CommentRepository;
import com.social.a406.domain.like.dto.LikedUserResponse;
import com.social.a406.domain.like.entity.CommentLike;
import com.social.a406.domain.like.repository.CommentLikeRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentLikeService {

    private final CommentLikeRepository commentLikeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addLike(String loginId, Long commentId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        if (commentLikeRepository.existsByUserAndComment(user, comment)) {
            throw new IllegalStateException("User already liked this comment");
        }

        CommentLike like = new CommentLike(comment, user);
        commentLikeRepository.save(like);

        comment.increaseLikeCount();
    }

    @Transactional
    public void removeLike(String loginId, Long commentId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        CommentLike like = commentLikeRepository.findByUserAndComment(user, comment)
                .orElseThrow(() -> new IllegalArgumentException("Like not found"));

        commentLikeRepository.delete(like);

        comment.decreaseLikeCount();
    }
}
