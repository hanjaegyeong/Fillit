package com.social.a406.domain.follow.event;

import com.social.a406.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FollowEvent {
    private User user;        // 팔로우 하는 사용자
    private User otherUser;   // 팔로우 당하는 사용자
}
