package com.social.a406.domain.comment.service;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.repository.BoardRepository;
import com.social.a406.domain.comment.dto.CommentRequest;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.comment.entity.Comment;
import com.social.a406.domain.comment.repository.CommentRepository;
import com.social.a406.domain.commentReply.repository.ReplyRepository;
import com.social.a406.domain.like.repository.CommentLikeRepository;
import com.social.a406.domain.notification.service.NotificationService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.exception.ForbiddenException;
import jakarta.persistence.Tuple;
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
    private final CommentLikeRepository commentLikeRepository;

    @Transactional
    public CommentResponse addComment(Long boardId, CommentRequest commentRequest, UserDetails userDetails) {
        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new ForbiddenException("User not found with Email: " + userDetails.getUsername()));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ForbiddenException("Board not found with id: " + boardId));

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
                .orElseThrow(() -> new ForbiddenException("AI user not found with personalId: " + personalId));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ForbiddenException("Board not found with id: " + boardId));

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
    public List<CommentResponse> getCommentsByBoard(String personalId, Long boardId) {
        List<Object[]> comments = commentRepository.findCommentsWithLikeStatusByBoardId(personalId, boardId);
        return comments.stream().map(this::mapToResponseWithLike).collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse getComment(Long commentId){
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new ForbiddenException("Not found comment"));
        return mapToResponse(comment);
    }

    @Transactional
    public CommentResponse getCommentWithLiked(String personalId, Long commentId){
        Tuple comment = commentRepository.getCommentWithLikeStatus(commentId, personalId);
        Object[] result = new Object[] {comment.get("comment", Comment.class), comment.get("isLiked", Boolean.class)};
        return mapToResponseWithLike(result);
    }

    @Transactional
    public Long getBoardIdByCommentId(Long commentId){
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new ForbiddenException("Not found comment"));
        return comment.getBoard().getId();
    }

    @Transactional
    public Long getCommentCountByBoard(Long boardId){
        return commentRepository.countByBoard_Id(boardId);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest, UserDetails userDetails) {
        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new ForbiddenException("User not found with Email: " + userDetails.getUsername()));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ForbiddenException("Comment not found with id: " + commentId));

        if (!comment.getUser().equals(user)) {
            throw new ForbiddenException("User not authorized to update this comment");
        }

        comment.updateContent(commentRequest.getContent());
        Object[] object = new Object[]{comment, commentLikeRepository.existsByUser_IdAndComment_Id(user.getId(), comment.getId())};
        return mapToResponseWithLike(object);
    }

    @Transactional
    public void deleteComment(Long commentId, UserDetails userDetails) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ForbiddenException("Comment not found with id: " + commentId));

        User user = userRepository.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new ForbiddenException("User not found with Email: " + userDetails.getUsername()));

        if (!comment.getUser().equals(user)) {
            throw new ForbiddenException("User not authorized to delete this comment");
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

    private CommentResponse mapToResponseWithLike(Object[] object) {
        if (object == null || object.length < 2) {
            throw new IllegalArgumentException("Invalid comment data");
        }
        Comment comment = (Comment) object[0];
        boolean like = (boolean) object[1];
        return CommentResponse.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .personalId(comment.getUser().getPersonalId())
                .profileImageUrl(comment.getUser().getProfileImageUrl())
                .likeCount(comment.getLikeCount())
                .commentReplyCount(replyRepository.countByComment_Id(comment.getId()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .isLiked(like)
                .build();
    }

    // AI의 게시글인지 확인 후 70% 확률로 생성
    public boolean isAIAndRandomCreate(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ForbiddenException("Board not found with id: " + boardId));
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
                () -> new ForbiddenException("Not found comment"));
        return comment.getUser().getPersonalId();
    }
}
