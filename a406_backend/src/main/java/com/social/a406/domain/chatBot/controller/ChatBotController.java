package com.social.a406.domain.chatBot.controller;

import com.social.a406.domain.chatBot.dto.AiChatRequest;
import com.social.a406.domain.chatBot.dto.AiChatResponse;
import com.social.a406.domain.chatBot.service.ChatBotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatBotController {

    private final ChatBotService chatBotService;

    // AI 챗봇
    @PostMapping
    public ResponseEntity<AiChatResponse> generateChat(@RequestBody AiChatRequest aiChatRequest){
        String chat = chatBotService.generateChat(aiChatRequest.getMessage());
        AiChatResponse response = new AiChatResponse(chat);
        return ResponseEntity.status(201).body(response);
    }
}
