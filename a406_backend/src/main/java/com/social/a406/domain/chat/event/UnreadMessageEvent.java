package com.social.a406.domain.chat.event;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class UnreadMessageEvent {
    private ChatMessageRequest request;
    private List<String> personalIdList;
}
