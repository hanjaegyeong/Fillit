package com.social.a406.domain.ai.scheduler;

import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AiScheduler {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Random random = new Random();
    private final ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
    private final UserService userService;

    private final String AI_COMMENT_ENDPOINT = "/api/ai/generate/comment";
    private final String RANDOM_AI_COMMENT_ENDPOINT = "/api/ai/generate/random/comment";
    private final String AI_BOARD_ENDPOINT = "/api/ai/generate/random/board";

    @Value("${EC2_SERVER_URL}")
    private String ec2ServerUrl;

    // AI 게시글 생성 컨트롤러 자동 호출
    @Scheduled(fixedDelay = 30000) // 10분(600000 밀리초)마다 실행하도록 변경하기
    public void callGenerateAiBoardController() {
        // 랜덤한 지연 시간 생성
        int delay = random.nextInt(60) + 3;

        try {
            System.out.println("Waiting for " + delay + " seconds before board triggering...");
            Thread.sleep(delay * 1000L);

            // EC2 컨트롤러 호출
            String response = restTemplate.getForObject(ec2ServerUrl + AI_BOARD_ENDPOINT, String.class);
            System.out.println("Response from EC2: " + response);
        } catch (Exception e) {
            System.err.println("Failed to call EC2 controller: " + e.getMessage());
        }
    }

    // 랜덤 게시글에 랜덤 AI 댓글 생성 컨트롤러 자동 호출
    // 본인이 댓글 단 게시글 / 본인 게시글 제외
    @Scheduled(fixedDelay = 30000) // 10분(600000 밀리초)마다 실행하도록 변경하기
    public void callGenerateAiCommentController() {
        // 랜덤한 지연 시간 생성
        int delay = random.nextInt(60) + 3;

        try {
            System.out.println("Waiting for " + delay + " seconds before comment triggering...");
            Thread.sleep(delay * 1000L);

            // EC2 컨트롤러 호출
            String response = restTemplate.getForObject(ec2ServerUrl + RANDOM_AI_COMMENT_ENDPOINT, String.class);
            System.out.println("Response from EC2: " + response);
        } catch (Exception e) {
            System.err.println("Failed to call EC2 controller: " + e.getMessage());
        }
    }

    // 사용자(personalId)가 게시글 업로드 후 AI댓글 자동 생성
    public void scheduleCommentCreation(Long boardId, String personalId) {
        taskScheduler.initialize();

        int delayInSeconds = ThreadLocalRandom.current().nextInt(10, 61); // 10초 ~ 60초 랜덤 딜레이
        System.out.println("Task scheduled to execute after " + delayInSeconds + " seconds");

        taskScheduler.schedule(() -> {
            try {
                // 주어진 personalId와 동일한 관심사를 가진 랜덤 AI 사용자 찾기
                String randomPersonalId = userService.getRandomUserWithMatchingInterest(personalId);

                if (randomPersonalId == null) {
                    System.err.println("No suitable user found for AI comment creation.");
                    return;
                }

                String response = restTemplate.getForObject(
                        ec2ServerUrl + AI_COMMENT_ENDPOINT + "?boardId=" + boardId + "&personalId=" + randomPersonalId,
                        String.class
                );

                System.out.println("AI Comment Created by " + randomPersonalId + ": " + response);
            } catch (Exception e) {
                System.err.println("Failed to create AI comment: " + e.getMessage());
            } finally {
                taskScheduler.shutdown(); // 작업 완료 후 스케줄러 종료. 없으면 반복.
            }
        }, triggerContext -> Instant.now().plusSeconds(delayInSeconds));
    }

}