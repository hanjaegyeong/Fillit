package com.social.a406.domain.chatBot.service;

import com.social.a406.domain.ai.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatBotService {

    private final AIService aiService;

    //AI 쳇봇 답장 생성
    public String generateChat(String message){
        return aiService.generateChat(message);
    }
}
