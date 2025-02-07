package com.social.a406.domain.like.service;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.repository.BoardRepository;
import com.social.a406.domain.like.dto.LikedUserResponse;
import com.social.a406.domain.like.entity.BoardLike;
import com.social.a406.domain.like.repository.BoardLikeRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardLikeService {

    private final BoardLikeRepository boardLikeRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addLike(String personalId, Long boardId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found"));

        if (boardLikeRepository.existsByUserAndBoard(user, board)) {
            throw new IllegalStateException("User already liked this board");
        }

        BoardLike like = new BoardLike(user, board);
        boardLikeRepository.save(like);

        board.increaseLikeCount();
//        return board;
    }

    @Transactional
    public void removeLike(String personalId, Long boardId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found"));

        BoardLike like = boardLikeRepository.findByUserAndBoard(user, board)
                .orElseThrow(() -> new IllegalArgumentException("Like not found"));

        boardLikeRepository.delete(like);

        board.decreaseLikeCount();
    }

    @Transactional(readOnly = true)
    public List<LikedUserResponse> getUsersWhoLikedBoard(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found"));

        return boardLikeRepository.findByBoard(board).stream()
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
