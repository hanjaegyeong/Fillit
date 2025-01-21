package com.social.a406.domain.hotissue.service;

import com.social.a406.domain.ai.service.AIService;
import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class YotubeFacadeService {

    private final AIService aiService;
    private final BoardService boardService;

    public YotubeFacadeService(AIService aiService, BoardService boardService) {
        this.aiService = aiService;
        this.boardService = boardService;
    }

    public BoardResponse generateBoardAndSave(String nickname, String apiKey, String prompt){
        String generatedContent = aiService.generateContent(nickname, apiKey, prompt);

        BoardRequest boardRequest = BoardRequest.builder()
                .content(generatedContent)
                .build();

        return boardService.createAiBoard(boardRequest, nickname);
    }
}
