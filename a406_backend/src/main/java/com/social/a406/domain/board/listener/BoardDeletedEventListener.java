package com.social.a406.domain.board.listener;

import com.social.a406.domain.board.event.BoardDeletedEvent;
import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.feed.entity.Feed;
import com.social.a406.domain.feed.repository.FeedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class BoardDeletedEventListener {

    @Autowired
    private FeedRepository feedRepository;

    @EventListener
    public void handleBoardDeletedEvent(BoardDeletedEvent event) {
        Board board = event.getBoard();
        // Board가 삭제될 때, 해당 게시물이 포함된 모든 Feed 항목 삭제
        List<Feed> feeds = feedRepository.findByBoard(board);
        feedRepository.deleteAll(feeds);
    }
}
