package  com.social.a406.domain.follow.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowRequest {

    // personalId으로 받기
    private String followeePersonalId; // 팔로우 대상자 personalId

    // 생성자, Getter, Setter
    public FollowRequest(String followeePersonalId) {
        this.followeePersonalId = followeePersonalId;
    }

}
