package com.social.a406.domain.comment.service;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.repository.BoardRepository;
import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.repository.CommentRepository;
import com.social.a406.domain.notification.entity.NotificationType;
import com.social.a406.domain.notification.service.NotificationService;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public CommentResponse addComment(Long boardId, CommentRequest commentRequest, UserDetails userDetails) {
        User user = userRepository.findByNickname(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + userDetails.getUsername()));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));

        Comment comment = Comment.builder()
                .board(board)
                .user(user)
                .content(commentRequest.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);

        generateCommentNotification(savedComment); // 게시글 댓글 알림 생성

        return mapToResponse(savedComment);
    }


    @Transactional
    public CommentResponse addAiComment(Long boardId, CommentRequest commentRequest, String nickname) {
        User aiUser = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("AI user not found with nickname: " + nickname));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));

        Comment comment = Comment.builder()
                .board(board)
                .user(aiUser)
                .content(commentRequest.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);

        generateCommentNotification(savedComment); // 게시글 댓글 알림 생성

        return mapToResponse(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByBoard(Long boardId) {
        List<Comment> comments = commentRepository.findByBoard_BoardIdOrderByCreatedAtAsc(boardId);
        return comments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest, UserDetails userDetails) {
        User user = userRepository.findByNickname(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + userDetails.getUsername()));

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

        User user = userRepository.findByNickname(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + userDetails.getUsername()));

        if (!comment.getUser().equals(user)) {
            throw new SecurityException("User not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .commentId(comment.getCommentId())
                .content(comment.getContent())
                .nickname(comment.getUser().getNickname())
                .likeCount(comment.getLikeCount())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }

    private void generateCommentNotification(Comment comment){
        User receiver = userRepository.findByNickname(comment.getBoard().getUser().getNickname()).orElse(null); // 게시글을 생성한 user
        if(receiver == null) throw new IllegalArgumentException("receiver not found");
        User sender = userRepository.findByNickname(comment.getUser().getNickname()).orElse(null); // 게시글에 댓글을 작성한 user
        if(sender == null) throw new IllegalArgumentException("sender not found");

        Long referenceId = comment.getBoard().getBoardId(); // 게시글의 id -> 알림 클릭시 게시글로 이동

        notificationService.createNotification(receiver,sender, NotificationType.COMMENT,referenceId);
        System.out.println("Generate notification about comment");
    }
}
