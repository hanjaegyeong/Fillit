package com.social.a406.domain.subreddit.controller;

import com.social.a406.domain.subreddit.dto.SubredditDTO;
import com.social.a406.domain.subreddit.entity.Subreddit;
import com.social.a406.domain.subreddit.service.SubredditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/subreddit")
@RequiredArgsConstructor
public class SubredditController {

    private final SubredditService subredditService;

    @GetMapping("/random")
    public ResponseEntity<SubredditDTO> getRandomSubreddit() {
        Subreddit randomSubreddit = subredditService.getRandomUserSubreddit();
        SubredditDTO subredditDTO = subredditService.toDTO(randomSubreddit);
        return ResponseEntity.ok(subredditDTO);
    }
}
