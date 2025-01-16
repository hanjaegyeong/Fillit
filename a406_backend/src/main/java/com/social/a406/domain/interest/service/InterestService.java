package com.social.a406.domain.interest.service;

import com.social.a406.domain.interest.dto.InterestResponse;
import com.social.a406.domain.interest.entity.Interest;
import com.social.a406.domain.interest.entity.UserInterest;
import com.social.a406.domain.interest.repository.InterestRepository;
import com.social.a406.domain.interest.repository.UserInterestRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
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

    public void addUserInterests(Long userId, List<String> interestContents) {
        // 유저 확인
        User user = userRepository.findById(userId)
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

    public List<InterestResponse> getUserInterests(Long userId) {
        // 유저-관심사 매핑 데이터 가져오기
        List<UserInterest> userInterests = userInterestRepository.findByUser_UserId(userId);

        // UserInterest -> UserInterestResponse로 변환
        return userInterests.stream()
                .map(userInterest -> new InterestResponse(
                        userInterest.getInterest().getInterestId(),
                        userInterest.getInterest().getContent()
                ))
                .collect(Collectors.toList());
    }
}
