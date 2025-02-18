package com.social.a406.domain.ai.service;

import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.messageQueue.MessageQueueService;
import com.social.a406.domain.chat.repository.ChatMessageRepository;
import com.social.a406.domain.chat.repository.ChatParticipantsRepository;
import com.social.a406.domain.chat.websocket.ChatWebSocketHandler;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AIChatService {
    private final AIService aiService;
    private final ChatWebSocketHandler webSocketHandler;
    private final ChatMessageRepository chatMessageRepository;
    private final ThreadPoolTaskScheduler chatTaskScheduler;
    private final UserService userService;
    private final ChatParticipantsRepository chatParticipantsRepository;
    private final MessageQueueService messageQueueService;

    private final Random random = new Random();
    private final int MINUTE = 60;

    private static final String PROMPT_CHAT =
            "Ensure your response is engaging and natural. "
                    + "Use Gen-Z slang, pop culture references, or trending topics where appropriate. "
                    + "If the message is not in English, respond appropriately based on your personality, such as saying 'I don’t speak this language well' or 'Can we chat in English?'. "
                    + "Keep your response within 200 characters when possible, but ensure at least 10 characters.";

    // AI 메시지 생성 비동기 실행
    public void processAiMessage(String aiPersonalId, String aiMainPrompt, String otherUserName, ChatMessageRequest chatMessageRequest) {

        int delay = random.nextInt(MINUTE) + MINUTE / 6; // 10초 ~ 1분 delay
        System.out.println("Waiting for " + delay + " seconds before chat triggering...");

        chatTaskScheduler.schedule(() -> {
            String content = chatMessageRequest.getMessageContent(); // 상대방 메세지
            String aiReply = generateChatReply(aiMainPrompt, otherUserName, content); // AI 메세지 생성


            // 메시지 큐를 통해 WebSocket으로 메시지 전송
            ChatMessageRequest newRequest = new ChatMessageRequest(chatMessageRequest.getChatRoomId(), aiReply, ChatMessageRequest.MessageType.TEXT);
            messageQueueService.addMessageToQueue(() -> {
                try {
                    webSocketHandler.sendMessageToChatRoom(aiPersonalId, newRequest);
                } catch (Exception e) {
                    System.err.println("Failed to send AI Message: " + e.getMessage());
                }
            });
        }, Instant.now().plusSeconds(delay));


    }

    /**
     * AI 챗봇 자동 응답 생성
     */
    public String generateChatReply(String aiPrompt, String otherUserName, String content) {
        int messageLength = content.length();

        String lengthPrompt;
        if (messageLength < 20) {
            lengthPrompt = "Keep it short and casual, like a quick text message.";
        } else if (messageLength < 100) {
            lengthPrompt = "Respond naturally with some detail to keep it engaging.";
        } else {
            lengthPrompt = "Provide a thoughtful and detailed response with depth.";
        }

        // ✅ 자연스러운 문장 구조로 개선
        String finalPrompt = aiPrompt + "\n\n"
                + "### Conversation ###\n"
                + otherUserName + " wrote: \"" + content + "\"\n\n"
                + "### Your response ###\n"
                + lengthPrompt + "\n\n"
                + PROMPT_CHAT;


        return aiService.generateContent(finalPrompt);
    }


}



