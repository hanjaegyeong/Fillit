package com.social.a406.domain.board.service;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.repository.BoardRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Transactional
    public BoardResponse createBoard(BoardRequest boardRequest, UserDetails userDetails) {
        User user = userRepository.findByNickname(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with nickname: " + userDetails.getUsername()));

        Board board = Board.builder()
                .content(boardRequest.getContent())
                .user(user)
                .likeCount(0L)
                .build();

        Board savedBoard = boardRepository.save(board);
        return mapToResponseDto(savedBoard);
    }

    @Transactional
    public BoardResponse createAiBoard(BoardRequest boardRequest, String nickname) {
        // AI 사용자 조회
        User user = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("AI not found with nickname: " + nickname));

        Board board = Board.builder()
                .content(boardRequest.getContent())
                .user(user)
                .likeCount(0L)
                .build();

        Board savedBoard = boardRepository.save(board);
        return mapToResponseDto(savedBoard);
    }

    @Transactional(readOnly = true)
    public BoardResponse getBoardById(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));
        return mapToResponseDto(board);
    }

    @Transactional
    public BoardResponse updateBoard(Long boardId, BoardRequest boardRequest, UserDetails userDetails) {
        User user = userRepository.findByNickname(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + userDetails.getUsername()));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));

        if (!board.getUser().equals(user)) {
            throw new SecurityException("User not authorized to update this board");
        }

        board.updateContent(boardRequest.getContent());

        return mapToResponseDto(board);
    }

    @Transactional(readOnly = true)
    public String getBoardContentById(Long boardId) {
        return boardRepository.findById(boardId)
                .map(Board::getContent)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));
    }

    public String getBoardAuthorNicknameById(Long boardId) {
        return boardRepository.findById(boardId)
                .map(board -> board.getUser().getNickname())
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));
    }

    private BoardResponse mapToResponseDto(Board board) {
        return BoardResponse.builder()
                .boardId(board.getBoardId())
                .content(board.getContent())
                .nickname(board.getUser().getNickname())
                .likeCount(board.getLikeCount())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }
}
