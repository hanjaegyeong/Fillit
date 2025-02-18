package com.social.a406.messaging.board.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardCreatedMessage {
    private String personalId;
    private Long boardId;
}
