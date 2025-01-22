package com.social.a406.domain.scheduler.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class RandomScheduler {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Random random = new Random();
    private final String AI_BOARD_ENDPOINT = "/api/ai/generate/board";

    @Value("${EC2_SERVER_URL}")
    private String ec2ServerUrl;

    // AI 게시글 생성 컨트롤러 자동 호출
    @Scheduled(fixedDelay = 300000) // 10분(600000 밀리초)마다 실행
    public void callGenerateAiBoardController() {
        // 랜덤한 지연 시간 생성
        int delay = random.nextInt(600) + 30; // 30초 ~ 10분 30초

        try {
            System.out.println("Waiting for " + delay + " seconds before triggering...");
            Thread.sleep(delay * 1000L);

            // EC2 컨트롤러 호출
            String response = restTemplate.getForObject(ec2ServerUrl + AI_BOARD_ENDPOINT, String.class);
            System.out.println("Response from EC2: " + response);
        } catch (Exception e) {
            System.err.println("Failed to call EC2 controller: " + e.getMessage());
        }
    }
}
