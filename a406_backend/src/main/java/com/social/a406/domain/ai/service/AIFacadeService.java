package com.social.a406.domain.ai.service;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// 각 서비스 조율해주는 Facade 서비스
@Service
@RequiredArgsConstructor
public class AIFacadeService {

    private final AIService aiService;
    private final BoardService boardService;

    public BoardResponse generateAndSaveBoard(String nickname, String apiKey, String prompt) {
        // AI 생성 로직 호출
        String generatedContent = aiService.generateContent(nickname, apiKey, prompt);

        // 게시글 생성 요청 DTO 생성
        BoardRequest boardRequest = BoardRequest.builder()
                .content(generatedContent)
                .build();

        // 게시글 저장 로직 호출
        return boardService.createAiBoard(boardRequest, nickname);
    }
}
