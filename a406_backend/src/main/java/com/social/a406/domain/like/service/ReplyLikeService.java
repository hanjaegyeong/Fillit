package com.social.a406.domain.like.service;


import com.social.a406.domain.commentReply.entity.Reply;
import com.social.a406.domain.commentReply.repository.ReplyRepository;
import com.social.a406.domain.like.dto.LikedUserResponse;
import com.social.a406.domain.like.entity.ReplyLike;
import com.social.a406.domain.like.repository.ReplyLikeRepository;
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
public class ReplyLikeService {

    private final ReplyLikeRepository replyLikeRepository;
    private final ReplyRepository replyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public void addLike(String personalId, Long replyId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("User not found"));

        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ForbiddenException("Reply not found"));

        if (replyLikeRepository.existsByUserAndReply(user, reply)) {
            throw new ForbiddenException("User already liked this reply");
        }

        ReplyLike like = new ReplyLike(reply, user);
        replyLikeRepository.save(like);

        notificationService.generateReplyLikeNotification(like);

        reply.increaseLikeCount();
    }

    @Transactional
    public void removeLike(String personalId, Long replyId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("User not found"));

        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ForbiddenException("Reply not found"));

        ReplyLike like = replyLikeRepository.findByUserAndReply(user, reply)
                .orElseThrow(() -> new ForbiddenException("Like not found"));

        replyLikeRepository.delete(like);

        reply.decreaseLikeCount();
    }

    @Transactional(readOnly = true)
    public List<LikedUserResponse> getUsersWhoLikedReply(Long replyId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ForbiddenException("Reply not found"));

        return replyLikeRepository.findByReply(reply).stream()
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
