package com.social.a406.domain.follow.service;


import com.social.a406.domain.follow.dto.FollowResponse;
import com.social.a406.domain.follow.dto.FollowSearchResponse;
import com.social.a406.domain.follow.entity.Follow;
import com.social.a406.domain.follow.repository.FollowRepository;
import com.social.a406.domain.notification.entity.NotificationType;
import com.social.a406.domain.notification.service.NotificationService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.messaging.follow.dto.FollowMessage;
import com.social.a406.messaging.follow.prodcuer.FollowPushToFeedProducer;
import com.social.a406.messaging.follow.prodcuer.UnfollowDeleteFeedProducer;
import com.social.a406.util.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
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

    private final FollowPushToFeedProducer followPushToFeedProducer;
    private final UnfollowDeleteFeedProducer unfollowDeleteFeedProducer;

    public Optional<Follow> findByFollowerAndFollowee(User follower, User followee) {
        return followRepository.findByFollowerAndFollowee(follower, followee);
    }

    public boolean followUser(User me, User followee) {
        Follow follow = new Follow();
        follow.setFollower(me);
        follow.setFollowee(followee);
        follow.setCreatedAt(LocalDateTime.now());
        Follow saveFollow = followRepository.save(follow); // save는 기본이라 repository에 따로 안써도 되나?

        followPushToFeedProducer.sendFollowCreateMessage(new FollowMessage(me.getPersonalId(), followee.getPersonalId()));  // 피드 추가 비동기
        generateFollowNotification(saveFollow); // 팔로우 알림 생성
//        eventPublisher.publishEvent(new FollowEvent(follower, followee));

        return saveFollow != null;
    }

    public boolean unfollowUser(User me, User followee) {
        Optional<Follow> followOptional = followRepository.findByFollowerAndFollowee(me, followee);

        if (!followOptional.isPresent()) return false; // 삭제 실패 (존재하지 않는 관계)

        unfollowDeleteFeedProducer.sendUnfollowCreatedMessage(new FollowMessage(me.getPersonalId(), followee.getPersonalId())); // 피드 제거 비동기
        followRepository.delete(followOptional.get());
        return true; // 삭제 성공


    }

    public List<FollowResponse> getFollowerList(String myPersonalId, User targetUser) {
        List<Follow> followerList = followRepository.findByFollowee(targetUser); // target : followee -> List : follower

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
    public List<FollowResponse> getFolloweeList(String myPersonalId, User targetUser) {
        List<Follow> followeeList = followRepository.findByFollower(targetUser); // 팔로우 당한사람에서 가져오기
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

    // email로 userId 찾기
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
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
