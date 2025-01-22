package com.social.a406.domain.interest.service;

import com.social.a406.domain.interest.dto.InterestResponse;
import com.social.a406.domain.interest.entity.Interest;
import com.social.a406.domain.interest.entity.UserInterest;
import com.social.a406.domain.interest.repository.InterestRepository;
import com.social.a406.domain.interest.repository.UserInterestRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestService {

    private final InterestRepository interestRepository;
    private final UserInterestRepository userInterestRepository;
    private final UserRepository userRepository;

    public void addUserInterests(String personalId, List<String> interestContents) {
        // 유저 확인
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

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
                .map(interest -> new InterestResponse(interest.getInterestId(), interest.getContent()))
                .collect(Collectors.toList());
    }

    public List<InterestResponse> getUserInterests(String personalId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with personalId: " + personalId));

        List<UserInterest> userInterests = userInterestRepository.findByUser_Id(user.getId());

        // UserInterest -> UserInterestResponse로 변환
        return userInterests.stream()
                .map(userInterest -> new InterestResponse(
                        userInterest.getInterest().getInterestId(),
                        userInterest.getInterest().getContent()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAllUserInterests(String personalId) {
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with personalId: " + personalId));

        // 해당 유저의 모든 관심사 매핑 삭제
        userInterestRepository.deleteByUser_Id(user.getId());
    }
}
