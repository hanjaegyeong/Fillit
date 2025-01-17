package  com.social.a406.domain.follow.dto;

import  com.social.a406.domain.user.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowRequest {

    // NicName으로 받기
    private String followeeNickName; // 팔로우 대상자 loginId

    // 생성자, Getter, Setter
    public FollowRequest(String followeeNickName) {
        this.followeeNickName = followeeNickName;
    }

}
