package com.social.a406.domain.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.social.a406.domain.chat.dto.ChatMessageRequest;
import com.social.a406.domain.chat.repository.ChatMessageRepository;
import com.social.a406.domain.chat.repository.ChatParticipantsRepository;
import com.social.a406.domain.chat.messageQueue.MessageQueueService;
import com.social.a406.domain.chat.websocket.ChatWebSocketHandler;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AIChatService {
    private final AIService aiService;
    private final ChatWebSocketHandler webSocketHandler;
    private final ChatMessageRepository chatMessageRepository;
    private final TaskScheduler chatTaskScheduler;
    private final UserService userService;
    private final ChatParticipantsRepository chatParticipantsRepository;
    private final MessageQueueService messageQueueService;


    private final Random random = new Random();
    private final int MINUTE = 60000;

    private static final String PROMPT_SUFFIX = "Please respond within 100 characters." +
            " Then, write '!@@@' at the end and send the representative theme of your post in one word without spacing. If it's related to a specific person, say it clearly, such as the person, the name of the place, the name of the game, and the name of the TV show if it's related to a specific TV show.";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();


    // AI 메시지 생성 비동기 실행
    public void processAiMessage(User aiUser, ChatMessageRequest chatMessageRequest) {

        int delay = random.nextInt(MINUTE) + 20 * MINUTE; // 1~20분 딜레이
        System.out.println("Waiting for " + delay + " seconds before chat triggering...");

//        chatTaskScheduler.schedule(() -> {
            String content = chatMessageRequest.getMessageContent(); // 상대방 메세지
//            String aiReply = generateChatReply(aiUser.getMainPrompt(), content); // AI 메세지 생성
            String aiReply = "It's AI Message"; // AI 메세지 생성

            // 메시지 큐를 통해 WebSocket으로 메시지 전송
            ChatMessageRequest newRequest = new ChatMessageRequest(chatMessageRequest.getChatRoomId(), aiReply, ChatMessageRequest.MessageType.TEXT);
            messageQueueService.addMessageToQueue(() -> {
                try {
                    webSocketHandler.sendMessageToChatRoom(aiUser.getPersonalId(), newRequest);
                } catch (IOException e) {
                    System.err.println("Failed to send AI Message: " + e.getMessage());
                }
            });
//        }, Instant.now().plusSeconds(delay));


    }

    /**
     * AI 챗봇 자동 응답 생성
     */
    public String generateChatReply(String aiPrompt, String content) {
        String finalPrompt = aiPrompt + " You are having a conversation. Respond naturally to this message: "
                + content + " " + PROMPT_SUFFIX;
        return aiService.generateContent(finalPrompt);
    }


}



