package com.social.a406.domain.comment.service;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.repository.BoardRepository;
import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.repository.CommentRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ReplyRepository replyRepository;

    @Transactional
    public CommentResponse addComment(Long boardId, CommentRequest commentRequest, UserDetails userDetails) {
        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with Email: " + userDetails.getUsername()));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));

        Comment comment = Comment.builder()
                .board(board)
                .user(user)
                .content(commentRequest.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);

        notificationService.generateCommentNotification(savedComment); // 게시글 댓글 알림 생성

        return mapToResponse(savedComment);
    }


    @Transactional
    public CommentResponse addAiComment(Long boardId, CommentRequest commentRequest, String personalId) {
        User aiUser = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("AI user not found with personalId: " + personalId));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));

        Comment comment = Comment.builder()
                .board(board)
                .user(aiUser)
                .content(commentRequest.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);

        notificationService.generateCommentNotification(savedComment); // 게시글 댓글 알림 생성

        return mapToResponse(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByBoard(Long boardId) {
        List<Comment> comments = commentRepository.findByBoard_IdOrderByCreatedAtAsc(boardId);
        return comments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse getComment(Long commentId){
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new IllegalArgumentException("Not found comment"));
        return mapToResponse(comment);
    }

    @Transactional
    public Long getBoardIdByCommentId(Long commentId){
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new IllegalArgumentException("Not found comment"));
        return comment.getBoard().getId();
    }

    @Transactional
    public Long getCommentCountByBoard(Long boardId){
        return commentRepository.countByBoard_Id(boardId);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest, UserDetails userDetails) {
        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with Email: " + userDetails.getUsername()));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        if (!comment.getUser().equals(user)) {
            throw new SecurityException("User not authorized to update this comment");
        }

        comment.updateContent(commentRequest.getContent());
        return mapToResponse(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, UserDetails userDetails) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with Email: " + userDetails.getUsername()));

        if (!comment.getUser().equals(user)) {
            throw new SecurityException("User not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .personalId(comment.getUser().getPersonalId())
                .profileImageUrl(comment.getUser().getProfileImageUrl())
                .likeCount(comment.getLikeCount())
                .commentReplyCount(replyRepository.countByComment_Id(comment.getId()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    // AI의 게시글인지 확인 후 70% 확률로 생성
    public boolean isAIAndRandomCreate(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));
        User user = board.getUser();
        if(isAiUser(user)){
            if(ThreadLocalRandom.current().nextInt(100) < 70){
                return true;
            }else { return false; }
        }else{
            System.out.println("Is not ai user's board");
            return false;
        }
    }

    public boolean isAiUser(User user){
        if(user.getMainPrompt() != null) return true;
        else return false;
    }

    @Transactional
    public String getPersonalIdById(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new IllegalArgumentException("Not found comment"));
        return comment.getUser().getPersonalId();
    }
}
