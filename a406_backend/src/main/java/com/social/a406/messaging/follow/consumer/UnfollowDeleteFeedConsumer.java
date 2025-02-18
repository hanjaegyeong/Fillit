package com.social.a406.messaging.follow.consumer;

import com.social.a406.domain.feed.service.FeedService;
import com.social.a406.messaging.follow.dto.FollowMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UnfollowDeleteFeedConsumer {
    private final FeedService feedService;

    @RabbitListener(queues = "unfollow.delete.feed", concurrency = "2")
    public void receiveUnfollowMessage(FollowMessage event){
        feedService.removeBoardsFromUserFeed(event.getMyPersonalId(), event.getOtherPersonalId());
    }
}
