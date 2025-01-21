package com.social.a406.domain.scheduler.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class RandomScheduler {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Random random = new Random();
    private final String EC2_URL = "http://localhost:8080/api/ai/generate/board/reddit?nickname=닉네임&apiKey=키값";

    @Scheduled(fixedDelay = 300000) // 10분(600000 밀리초)마다 실행
    public void callRandomController() {
        // 랜덤한 지연 시간 생성
        int delay = random.nextInt(600) + 30; // 30초 ~ 10분 30초

        try {
            System.out.println("Waiting for " + delay + " seconds before triggering...");
            Thread.sleep(delay * 1000L);

            // EC2 컨트롤러 호출
            String response = restTemplate.getForObject(EC2_URL, String.class);
            System.out.println("Response from EC2: " + response);
        } catch (Exception e) {
            System.err.println("Failed to call EC2 controller: " + e.getMessage());
        }
    }
}
