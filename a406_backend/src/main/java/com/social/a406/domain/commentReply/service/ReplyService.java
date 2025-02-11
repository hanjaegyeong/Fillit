package com.social.a406.domain.commentReply.service;

import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.repository.CommentRepository;
import com.social.a406.domain.commentReply.dto.ReplyRequest;
import com.social.a406.domain.commentReply.dto.ReplyResponse;
import com.social.a406.domain.commentReply.entity.Reply;
import com.social.a406.domain.commentReply.repository.ReplyRepository;
import com.social.a406.domain.notification.service.NotificationService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReplyService {
    private final ReplyRepository replyRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // 대댓글 저장
    @Transactional
    public ReplyResponse saveReply(Long commentId, ReplyRequest request, String personalId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with personalId: " + personalId));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with commentId: " + commentId));

        Reply reply = Reply.builder()
                .comment(comment)
                .user(user)
                .content(request.getContent())
                .build();

        Reply savedReply = replyRepository.save(reply);
        notificationService.generateCommentReplyNotification(savedReply, commentId);
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

    // 댓글 삭제될때 대댓글도 함께 삭제
    @Transactional
    public void deleteAllReplyByComment(Long commentId, UserDetails userDetails){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));
        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with Email: " + userDetails.getUsername()));

        replyRepository.deleteAllByComment_Id(commentId);

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
        List<Reply> replys = replyRepository.findByComment_IdOrderByCreatedAtAsc(commentId);
        return replys.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public String getReply(Long replyId) {
        Reply reply = replyRepository.findById(replyId).orElseThrow(
                () -> new IllegalArgumentException("Not found reply"));
        return reply.getContent();
    }

    @Transactional(readOnly = true)
    public Comment getCommentByReplyId(Long replyId){
        Reply reply = replyRepository.findById(replyId).orElseThrow(
                () -> new IllegalArgumentException("Not found reply"));
        return reply.getComment();
    }

    public ReplyResponse mapToResponse(Reply reply){
        return ReplyResponse.builder()
                .replyId(reply.getId())
                .personalId(reply.getUser().getPersonalId())
                .profileImageUrl(reply.getUser().getProfileImageUrl())
                .content(reply.getContent())
                .likeCount(reply.getLikeCount())
                .updatedAt(reply.getUpdatedAt())
                .createdAt(reply.getCreatedAt())
                .build();
    }

    // AI의 댓글인지 확인 후 70% 확률로 생성
    public boolean isAIAndRandomCreate(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new IllegalArgumentException("Not found comment"));
        User user = comment.getUser();
        if(isAiUser(user)){
            if(ThreadLocalRandom.current().nextInt(100) < 70){
                return true;
            }else { return false; }
        }else{
            System.out.println("Is not ai user's comment");
            return false;
        }
    }

    // ai 유저인지 확인
    public boolean isAiUser(User user){
        if(user.getMainPrompt() != null) return true;
        else return false;
    }
}
