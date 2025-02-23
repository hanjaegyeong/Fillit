package com.social.a406.domain.interest.service;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.repository.BoardRepository;
import com.social.a406.domain.interest.dto.InterestResponse;
import com.social.a406.domain.interest.entity.BoardInterest;
import com.social.a406.domain.interest.entity.Interest;
import com.social.a406.domain.interest.entity.UserInterest;
import com.social.a406.domain.interest.repository.BoardInterestRepository;
import com.social.a406.domain.interest.repository.InterestRepository;
import com.social.a406.domain.interest.repository.UserInterestRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.exception.ForbiddenException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestService {

    private final InterestRepository interestRepository;
    private final UserInterestRepository userInterestRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final BoardInterestRepository boardInterestRepository;

    public void addUserInterests(String personalId, List<String> interestContents) {
        // 유저 확인
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("User not found"));

        // 관심사 리스트를 DB에서 가져오거나, 존재하지 않으면 새로 추가
        List<Interest> interests = interestContents.stream()
                .map(content -> interestRepository.findByContent(content)
                        .orElseGet(() -> interestRepository.save(new Interest(content))))
                .toList();

        // UserInterest 저장
        List<UserInterest> userInterests = interests.stream()
                .map(interest -> new UserInterest(user, interest))
                .toList();

        userInterestRepository.saveAll(userInterests);
    }

    public List<InterestResponse> getAllInterests() {
        return interestRepository.findAll().stream()
                .map(interest -> new InterestResponse(interest.getId(), interest.getContent()))
                .collect(Collectors.toList());
    }

    public List<InterestResponse> getUserInterests(String personalId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("User not found with personalId: " + personalId));

        List<UserInterest> userInterests = userInterestRepository.findByUser_Id(user.getId());

        // UserInterest -> UserInterestResponse로 변환
        return userInterests.stream()
                .map(userInterest -> new InterestResponse(
                        userInterest.getInterest().getId(),
                        userInterest.getInterest().getContent()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAllUserInterests(String personalId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("User not found with personalId: " + personalId));

        // 해당 유저의 모든 관심사 매핑 삭제
        userInterestRepository.deleteByUser_Id(user.getId());
    }

    public void addBoardInterests(Long boardId, List<String> interestContents) {
        // 게시글 확인
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ForbiddenException("Board not found"));

        // 관심사 리스트를 DB에서 가져오거나, 존재하지 않으면 새로 추가
        List<Interest> interests = interestContents.stream()
                .map(content -> interestRepository.findByContent(content)
                        .orElseGet(() -> interestRepository.save(new Interest(content))))
                .toList();

        // BoardInterest 저장
        List<BoardInterest> boardInterests = interests.stream()
                .map(interest -> new BoardInterest(board, interest))
                .toList();

        boardInterestRepository.saveAll(boardInterests);
    }

    public List<String> getBoardInterests(Long boardId) {
        // 게시글 확인
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ForbiddenException("Board not found"));

        List<BoardInterest> boardInterests = boardInterestRepository.findByBoard_Id(board.getId());
        List<String> Interests = new ArrayList<>();
        for(BoardInterest boardInterest : boardInterests){
            Interests.add(boardInterest.getInterest().getContent());
        }

        return Interests;
    }

    @Transactional
    public void deleteAllBoardInterests(Long boardId) {
        // 게시글 확인
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ForbiddenException("Board not found"));

        // 해당 유저의 모든 관심사 매핑 삭제
        boardInterestRepository.deleteByBoard_Id(board.getId());
    }
}
