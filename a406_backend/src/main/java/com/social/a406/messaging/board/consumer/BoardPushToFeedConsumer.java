package com.social.a406.messaging.board.consumer;

import com.social.a406.domain.feed.service.FeedService;
import com.social.a406.messaging.board.dto.BoardCreatedMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BoardPushToFeedConsumer {
    private final FeedService feedService;

    @RabbitListener(queues = "board.push.feed", concurrency = "2")
    public void receiveBoardCreatedMessage(BoardCreatedMessage event){
        feedService.insertBoardToFollowerFeed(event.getPersonalId(), event.getBoardId());
    }


}
