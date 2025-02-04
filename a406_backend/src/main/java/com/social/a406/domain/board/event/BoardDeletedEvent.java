package com.social.a406.domain.board.event;

import com.social.a406.domain.board.entity.Board;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class BoardDeletedEvent extends ApplicationEvent {
    private final Board board;

    public BoardDeletedEvent(Object source, Board board) {
        super(source);
        this.board = board;
    }
}
