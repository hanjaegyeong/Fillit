package com.social.a406.domain.chat.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class ChatRoomSearchResponse {
    private Long cursorId;
    private List<ChatRoomResponse> responses;
}
