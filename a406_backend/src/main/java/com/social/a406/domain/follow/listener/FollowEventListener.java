package com.social.a406.domain.follow.listener;

import com.social.a406.domain.feed.service.FeedService;
import com.social.a406.domain.follow.event.FollowEvent;
import com.social.a406.domain.follow.event.UnfollowEvent;
import com.social.a406.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FollowEventListener {

    private final FeedService feedService;

    @Async
    @EventListener
    public void handleFollowEvent(FollowEvent event) {
        User user = event.getUser();
        User otherUser = event.getOtherUser();

        // ✅ 팔로우 시 otherUser의 게시글을 user의 피드에 추가
        feedService.addBoardsToUserFeed(user, otherUser);
    }

    @Async
    @EventListener
    public void handleUnfollowEvent(UnfollowEvent event) {
        User user = event.getUser();
        User otherUser = event.getOtherUser();

        // ✅ 언팔로우 시 user의 피드에서 otherUser의 게시글 삭제
        feedService.removeBoardsFromUserFeed(user, otherUser);
    }
}
