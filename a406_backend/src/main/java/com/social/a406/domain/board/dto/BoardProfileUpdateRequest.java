package com.social.a406.domain.board.dto;

import lombok.Getter;

@Getter
public class BoardProfileUpdateRequest {
    Long boardId;
    Double x;
    Double y;
    Double z;
    Integer pageNumber;
}
