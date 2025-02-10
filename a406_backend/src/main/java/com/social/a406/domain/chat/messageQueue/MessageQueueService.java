package com.social.a406.domain.chat.messageQueue;

import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
public class MessageQueueService {

    private final Queue<Runnable> messageQueue = new ConcurrentLinkedQueue<>();
    private final ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();

    public MessageQueueService() {
        taskScheduler.initialize();
    }

    public void addMessageToQueue(Runnable task) {
        messageQueue.add(task);
        processNextMessage();
    }

    private void processNextMessage() {
        Runnable task = messageQueue.poll();
        if (task != null) {
            // ✅ WebSocket이 사용 가능할 때 즉시 실행
            taskScheduler.schedule(task, Instant.now());

            // ✅ WebSocket이 사용 가능하지 않을 경우, 짧은 시간 후 다시 실행
            taskScheduler.schedule(this::processNextMessage, Instant.now().plusMillis(10));
        }
    }
}

