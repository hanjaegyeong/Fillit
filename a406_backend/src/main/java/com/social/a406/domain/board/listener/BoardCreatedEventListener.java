package com.social.a406.domain.board.listener;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.event.BoardCreatedEvent;
import com.social.a406.domain.feed.entity.Feed;
import com.social.a406.domain.feed.repository.FeedRepository;
import com.social.a406.domain.follow.entity.Follow;
import com.social.a406.domain.follow.repository.FollowRepository;
import com.social.a406.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class BoardCreatedEventListener {

    private final FollowRepository followRepository;
    private final FeedRepository feedRepository;

    @EventListener
    public void handleBoardCreatedEvent(BoardCreatedEvent event) {
        Board board = event.getBoard();
        User boardAuthor = board.getUser();
        
        // 내 feed 에 먼저 저장
        Feed myFeed = Feed.builder()
                .user(board.getUser())
                .board(board)
                .isRecommended(false)
                .createdAt(board.getCreatedAt())
                .build();

        feedRepository.save(myFeed);

        // boardAuthor를 팔로우하는 모든 팔로워 조회
        List<Follow> followers = followRepository.findByFollowee(boardAuthor);
        for (Follow follow : followers) {
            User follower = follow.getFollower();
            Feed feed = Feed.builder()
                    .user(follower)
                    .board(board)
                    .isRecommended(false)
                    .createdAt(board.getCreatedAt())
                    .build();

            feedRepository.save(feed);
        }
    }
}
