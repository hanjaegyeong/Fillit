package com.social.a406.domain.commentReply.service;

import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.repository.CommentRepository;
import com.social.a406.domain.commentReply.dto.ReplyRequest;
import com.social.a406.domain.commentReply.dto.ReplyResponse;
import com.social.a406.domain.commentReply.entity.Reply;
import com.social.a406.domain.commentReply.repository.ReplyRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReplyService {
    private final ReplyRepository replyRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    // 대댓글 저장
    @Transactional
    public ReplyResponse saveReply(Long commentId, ReplyRequest request, UserDetails userDetails) {
        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with personalId: " + userDetails.getUsername()));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with commentId: " + commentId));

        System.out.println(comment);

        Reply reply = Reply.builder()
                .comment(comment)
                .user(user)
                .content(request.getContent())
                .build();

        Reply savedReply = replyRepository.save(reply);

        return mapToResponse(savedReply);
    }

    
    // 대댓글 수정
    @Transactional
    public ReplyResponse updateReply(Long replyId, ReplyRequest request, UserDetails userDetails) {
        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with personalId: " + userDetails.getUsername()));
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("Reply not found with id: " + replyId));

        // 접근가능 권한 검증
        if(!user.equals(reply.getUser())) throw new SecurityException("User not authorized to update this reply");

        reply.updateReplyContent(request.getContent()); // 수정

        return mapToResponse(reply);
    }

    // 대댓글 삭제
    @Transactional
    public void deleteReply(Long replyId, UserDetails userDetails) {
        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with personalId: " + userDetails.getUsername()));
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("Reply not found with id: " + replyId));

        // 접근가능 권한 검증
        if(!user.equals(reply.getUser())) throw new SecurityException("User not authorized to delete this reply");

        replyRepository.delete(reply);
    }

    // 대댓글목록 가져오기
    @Transactional(readOnly = true)
    public List<ReplyResponse> getReplyList(Long commentId) {
        List<Reply> replys = replyRepository.findByComment_CommentIdOrderByCreatedAtAsc(commentId);
        return replys.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ReplyResponse mapToResponse(Reply reply){
        return ReplyResponse.builder()
                .replyId(reply.getId())
                .personalId(reply.getUser().getPersonalId())
                .content(reply.getContent())
                .likeCount(reply.getLikeCount())
                .updatedAt(reply.getUpdatedAt())
                .createdAt(reply.getCreatedAt())
                .build();
    }

}
