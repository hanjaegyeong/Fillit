package com.social.a406.domain.hotissue.controller;


import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.hotissue.entity.Youtube;
import com.social.a406.domain.hotissue.service.YotubeFacadeService;
import com.social.a406.domain.hotissue.service.YoutubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotissue/youtube")
public class YoutubeController {

    private final YoutubeService youtubeService;
    private final YotubeFacadeService youtubeFacadeService;

    @Autowired
    public YoutubeController(YoutubeService youtubeService, YotubeFacadeService youtubeFacadeService) {
        this.youtubeService = youtubeService;
        this.youtubeFacadeService = youtubeFacadeService;
    }


    @PostMapping
    public ResponseEntity<List<Youtube>> getPopularVideos(@RequestParam(defaultValue = "5") int maxResults) {
        // YoutubeService를 통해 인기 동영상 가져오기
        List<Youtube> youtubeList = youtubeService.getPopularVideos(maxResults);

        return ResponseEntity.ok(youtubeList);
    }

    @PostMapping("/board")
    public ResponseEntity<BoardResponse> generateBoard(@RequestParam String nickname,
                                                       @RequestParam String apiKey,
                                                       @RequestParam Long id){
        String prompt = youtubeService.getYoutubePrompt(id);
        BoardResponse boardResponse = youtubeFacadeService.generateBoardAndSave(nickname,apiKey,prompt);

        return ResponseEntity.ok(boardResponse);
    }
}
