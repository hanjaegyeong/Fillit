package com.social.a406.domain.like.service;

import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.repository.CommentRepository;
import com.social.a406.domain.like.dto.LikedUserResponse;
import com.social.a406.domain.like.entity.CommentLike;
import com.social.a406.domain.like.repository.CommentLikeRepository;
import com.social.a406.domain.notification.service.NotificationService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.exception.ForbiddenException;
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
    private final NotificationService notificationService;

    @Transactional
    public void addLike(String personalId, Long commentId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ForbiddenException("Comment not found"));

        if (commentLikeRepository.existsByUserAndComment(user, comment)) {
            throw new ForbiddenException("User already liked this comment");
        }

        CommentLike like = new CommentLike(comment, user);
        commentLikeRepository.save(like);

        notificationService.generateCommentLikeNotification(like);

        comment.increaseLikeCount();
    }

    @Transactional
    public void removeLike(String personalId, Long commentId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ForbiddenException("Comment not found"));

        CommentLike like = commentLikeRepository.findByUserAndComment(user, comment)
                .orElseThrow(() -> new ForbiddenException("Like not found"));

        commentLikeRepository.delete(like);

        comment.decreaseLikeCount();
    }

    @Transactional(readOnly = true)
    public List<LikedUserResponse> getUsersWhoLikedComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        return commentLikeRepository.findByComment(comment).stream()
                .map(like -> {
                    User user = like.getUser();
                    return new LikedUserResponse(
                            user.getPersonalId(),
                            user.getProfileImageUrl()
                    );
                })
                .collect(Collectors.toList());
    }
}
