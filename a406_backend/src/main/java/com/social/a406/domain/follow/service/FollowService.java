package com.social.a406.domain.follow.service;


import com.social.a406.domain.follow.dto.FollowSearchResponse;
import com.social.a406.domain.follow.dto.FollowResponse;
import com.social.a406.domain.follow.entity.Follow;
import com.social.a406.domain.follow.repository.FollowRepository;
import com.social.a406.domain.notification.entity.NotificationType;
import com.social.a406.domain.notification.service.NotificationService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.messaging.follow.dto.FollowMessage;
import com.social.a406.messaging.follow.prodcuer.UnfollowDeleteFeedProducer;
import com.social.a406.util.exception.BadRequestException;
import com.social.a406.util.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ApplicationEventPublisher eventPublisher;
    private final UnfollowDeleteFeedProducer unfollowDeleteFeedProducer;

    public void followUser(String followerPersonalId, String followeePersonalId) {
        if(followerPersonalId.equals(followeePersonalId) ||
                followRepository.existsByFollowee_PersonalIdAndFollower_PersonalId(followeePersonalId, followerPersonalId)){
            throw new BadRequestException("You can't follow this person");
        }

        // 팔로우할 사용자 정보 받아오기
        User follower = userRepository.findByPersonalId(followerPersonalId)
                .orElseThrow(() -> new IllegalArgumentException("follower not found"));
        User followee = userRepository.findByPersonalId(followeePersonalId)
                .orElseThrow(() -> new IllegalArgumentException("followee not found"));

        Follow follow = Follow.builder()
                .follower(follower)
                .followee(followee)
                .createdAt(LocalDateTime.now())
                .build();
        Follow saveFollow = followRepository.save(follow);

        generateFollowNotification(saveFollow); // 팔로우 알림 생성
//        eventPublisher.publishEvent(new FollowEvent(follower, followee));
    }

    public void unfollowUser(String followerPersonalId, String followeePersonalId) {
        // 언팔로우할 사용자 정보 받아오기
        User follower = userRepository.findByPersonalId(followerPersonalId)
                .orElseThrow(() -> new ForbiddenException("User not found"));
        User followee = userRepository.findByPersonalId(followeePersonalId)
                .orElseThrow(() -> new ForbiddenException("User not found"));
        Follow followOptional = followRepository.findByFollowerAndFollowee(follower, followee).orElseThrow(
                () -> new BadRequestException("You can't unfollow"));

        unfollowDeleteFeedProducer.sendUnfollowCreatedMessage(new FollowMessage(follower.getPersonalId(), followee.getPersonalId())); // 피드 제거 비동기
        followRepository.delete(followOptional);
    }

    public List<FollowResponse> getFollowerList(String myPersonalId, String followeePersonalId) {
        User followeeUser = userRepository.findByPersonalId(followeePersonalId).orElseThrow(
                () -> new ForbiddenException("Not found user"));
        List<Follow> followerList = followRepository.findByFollowee(followeeUser);

        // 내 정보 조회
        User me = userRepository.findByPersonalId(myPersonalId)
                .orElseThrow(() -> new ForbiddenException("Not found my info"));

        // 응답 리스트 초기화
        List<FollowResponse> responses = new ArrayList<>();

        for (Follow follower : followerList) {
            boolean isFollow = followRepository.existsByFolloweeIdAndFollowerId(
                    follower.getFollower().getId(), me.getId());
            User followerUser = follower.getFollower();
            responses.add(new FollowResponse(
                    followerUser.getPersonalId(),
                    followerUser.getName(),
                    followerUser.getProfileImageUrl(),
                    isFollow));
        }

        return responses;
    }


    // 나의 팔로잉
    public List<FollowResponse> getFolloweeList(String myPersonalId, String followerPersonalId) {
        User followerUser = userRepository.findByPersonalId(followerPersonalId).orElseThrow(
                () -> new ForbiddenException("Not found user"));
        List<Follow> followeeList = followRepository.findByFollower(followerUser); // 팔로우 당한사람에서 가져오기
        // 내 정보 조회
        User me = userRepository.findByPersonalId(myPersonalId)
                .orElseThrow(() -> new ForbiddenException("Not found my info"));

        // 응답 리스트 초기화
        List<FollowResponse> responses = new ArrayList<>();

        for (Follow followee : followeeList) {
            boolean isFollow = followRepository.existsByFolloweeIdAndFollowerId(
                    followee.getFollowee().getId(), me.getId());

            User followeeUser = followee.getFollowee();
            responses.add(new FollowResponse(
                    followeeUser.getPersonalId(),
                    followeeUser.getName(),
                    followeeUser.getProfileImageUrl(),
                    isFollow));
        }
        return responses;
    }

    // personalId로 userId 찾기
    public Optional<User> findByPersonalId(String personalId) {
        return userRepository.findByPersonalId(personalId);
    }

    private void generateFollowNotification(Follow follow) {
        // referenceId -> followId
        notificationService.createNotification(follow.getFollowee(), follow.getFollower(), NotificationType.FOLLOW, follow.getId());
        System.out.println("Generate notification about follow");
    }

    @Transactional
    public List<FollowSearchResponse> searchFollower(String myPersonalId, String personalId, String word) {
        userRepository.findByPersonalId(personalId).orElseThrow(
                ()-> new ForbiddenException("Not found user"));
        List<Object[]> result = followRepository.searchFollowerWithFollowStatus(personalId, word, myPersonalId);
        return  result.stream().map(r -> mapToSearchDto(
                (User) r[0],
                (boolean) r[1]
                )).toList();
    }

    @Transactional
    public List<FollowSearchResponse> searchFollowee(String myPersonalId, String personalId, String word) {
        userRepository.findByPersonalId(personalId).orElseThrow(
                ()-> new ForbiddenException("Not found user"));
        List<Object[]> result = followRepository.searchFolloweeWithFollowStatus(personalId, word, myPersonalId);
        return  result.stream().map(r -> mapToSearchDto(
                (User) r[0],
                (boolean) r[1]
        )).toList();
    }

    public FollowSearchResponse mapToSearchDto(User user, boolean isFollow){
        return FollowSearchResponse.builder()
                .personalId(user.getPersonalId())
                .name(user.getName())
                .profileImageUrl(user.getProfileImageUrl())
                .isFollow(isFollow)
                .build();
    }
}
