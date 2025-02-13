package com.social.a406.domain.follow.event;

import com.social.a406.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UnfollowEvent {
    private User user;        // 언팔로우 하는 사용자
    private User otherUser;   // 언팔로우 당하는 사용자
}
