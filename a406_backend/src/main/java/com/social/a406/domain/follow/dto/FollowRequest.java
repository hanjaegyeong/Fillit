package  com.social.a406.domain.follow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowRequest {

    // personalId으로 받기
    private String followeePersonalId; // 팔로우 대상자 personalId

}
