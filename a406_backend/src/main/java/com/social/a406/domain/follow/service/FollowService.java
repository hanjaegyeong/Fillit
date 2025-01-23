package  com.social.a406.domain.follow.service;


import  com.social.a406.domain.follow.entity.Follow;
import  com.social.a406.domain.follow.repository.FollowRepository;
import com.social.a406.domain.notification.entity.NotificationType;
import com.social.a406.domain.notification.service.NotificationService;
import  com.social.a406.domain.user.entity.User;

import  com.social.a406.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public FollowService(FollowRepository followRepository, UserRepository userRepository, NotificationService notificationService) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public Optional<Follow> findByFollowerAndFollowee (User follower, User followee) {
        return followRepository.findByFollowerAndFollowee(follower, followee) ;
    }

    public boolean followUser(User follower, User followee) {
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowee(followee);
        follow.setCreatedAt(LocalDateTime.now());
        Follow saveFollow =  followRepository.save(follow); // save는 기본이라 repository에 따로 안써도 되나?

        generateFollowNotification(saveFollow); // 팔로우 알림 생성

        return saveFollow != null;
    }

    public boolean unfollowUser(User follower, User followee) {
        Optional<Follow> followOptional = followRepository.findByFollowerAndFollowee(follower, followee);

        if (followOptional.isPresent()) {
            followRepository.delete(followOptional.get());
            return true; // 삭제 성공
        }
        return false; // 삭제 실패 (존재하지 않는 관계)
    }

    // 나의 팔로워
    public List<Follow> getFollowerList (User user) {
        List<Follow> userList = followRepository.findByFollowee(user); // 팔로우 당한사람에서 가져오기
        // UserList로 바꿔주기
        return userList;
    }

    // 나의 팔로잉
    public List<Follow> getFolloweeList (User user) {
        List<Follow> userList = followRepository.findByFollower(user); // 팔로우 당한사람에서 가져오기
        return userList;
    }

    // email로 userId 찾기
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // personalId로 userId 찾기
    public Optional<User> findByPersonalId(String personalId) {
        return userRepository.findByPersonalId(personalId);
    }

    private void generateFollowNotification(Follow follow){
        // referenceId -> followId
        notificationService.createNotification(follow.getFollowee(), follow.getFollower(), NotificationType.FOLLOW, follow.getFollowId());
        System.out.println("Generate notification about follow");
    }

}
