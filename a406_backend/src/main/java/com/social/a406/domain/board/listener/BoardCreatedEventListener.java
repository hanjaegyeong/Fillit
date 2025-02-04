package com.social.a406.domain.board.listener;

import com.social.a406.domain.board.event.BoardCreatedEvent;
import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.feed.entity.Feed;
import com.social.a406.domain.feed.repository.FeedRepository;
import com.social.a406.domain.follow.entity.Follow;
import com.social.a406.domain.follow.repository.FollowRepository;
import com.social.a406.domain.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class BoardCreatedEventListener {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private FeedRepository feedRepository;

    @EventListener
    public void handleBoardCreatedEvent(BoardCreatedEvent event) {
        Board board = event.getBoard();
        User boardAuthor = board.getUser();
        // boardAuthor를 팔로우하는 모든 팔로워 조회
        List<Follow> followers = followRepository.findByFollowee(boardAuthor);
        LocalDateTime now = LocalDateTime.now();
        for (Follow follow : followers) {
            User follower = follow.getFollower();
            Feed feed = Feed.builder()
                    .user(follower)
                    .board(board)
                    .isRecommended(false)
                    .addedAt(now)
                    .build();

            feedRepository.save(feed);
        }
    }
}
