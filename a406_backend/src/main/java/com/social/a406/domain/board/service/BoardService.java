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

    // 게시글 생성
    @Transactional
    public BoardResponse createBoard(BoardRequest boardRequest, UserDetails userDetails) {
        User user = findUserBypersonalId(userDetails.getUsername());
        Board board = buildBoard(boardRequest, user);
        return mapToResponseDto(boardRepository.save(board));
    }

    // AI 게시글 생성
    @Transactional
    public BoardResponse createAiBoard(BoardRequest boardRequest, String aiPersonalId) {
        User aiUser = findUserBypersonalId(aiPersonalId);
        Board board = buildBoard(boardRequest, aiUser);
        return mapToResponseDto(boardRepository.save(board));
    }

    // 게시글 단건 조회
    @Transactional(readOnly = true)
    public BoardResponse getBoardById(Long boardId) {
        Board board = findBoardById(boardId);
        return mapToResponseDto(board);
    }

    // 게시글 수정
    @Transactional
    public BoardResponse updateBoard(Long boardId, BoardRequest boardRequest, UserDetails userDetails) {
        User user = findUserBypersonalId(userDetails.getUsername());
        Board board = findBoardById(boardId);

        validateBoardOwnership(board, user);

        board.updateContent(boardRequest.getContent());
        return mapToResponseDto(board);
    }

    // 게시글 내용 조회
    @Transactional(readOnly = true)
    public String getBoardContentById(Long boardId) {
        return findBoardById(boardId).getContent();
    }

    // 게시글 작성자 닉네임 조회
    @Transactional(readOnly = true)
    public String getBoardAuthorpersonalIdById(Long boardId) {
        return findBoardById(boardId).getUser().getPersonalId();
    }

    // 유저 조회 유틸 메서드
    private User findUserBypersonalId(String personalId) {
        return userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with personalId: " + personalId));
    }

    // 게시글 조회 유틸 메서드
    private Board findBoardById(Long boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));
    }

    // 게시글 생성 유틸 메서드
    private Board buildBoard(BoardRequest boardRequest, User user) {
        return Board.builder()
                .content(boardRequest.getContent())
                .user(user)
                .likeCount(0L)
                .x(boardRequest.getX())
                .y(boardRequest.getY())
                .keyword(boardRequest.getKeyword())
                .pageNumber(boardRequest.getPageNumber())
                .build();
    }

    // 게시글 소유권 검증
    private void validateBoardOwnership(Board board, User user) {
        if (!board.getUser().equals(user)) {
            throw new SecurityException("User is not authorized to update this board");
        }
    }

    // Board 엔티티를 Response DTO로 변환
    private BoardResponse mapToResponseDto(Board board) {
        return BoardResponse.builder()
                .boardId(board.getBoardId())
                .content(board.getContent())
                .personalId(board.getUser().getPersonalId())
                .likeCount(board.getLikeCount())
                .x(board.getX())
                .y(board.getY())
                .keyword(board.getKeyword())
                .pageNumber(board.getPageNumber())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }
}
