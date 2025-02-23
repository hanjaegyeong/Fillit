package com.social.a406.domain.feed.controller;

import com.social.a406.domain.feed.dto.FeedResponseDto;
import com.social.a406.domain.feed.service.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    @Autowired
    private FeedService feedService;

    @GetMapping
    public ResponseEntity<FeedResponseDto> getFeed(
            @AuthenticationPrincipal UserDetails userDetail,
            @RequestParam(defaultValue = "9") int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursorFollow,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursorRecommend) {
        System.out.println("cursor Follow: " +cursorRecommend);
        System.out.println("cursorRecommend: "+cursorRecommend);
        String personalId = userDetail.getUsername();
        FeedResponseDto feed = feedService.getFeed(personalId, limit, cursorFollow, cursorRecommend);
        return ResponseEntity.ok(feed);
    }


}
