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

    /**
     * 피드 조회 엔드포인트
     * @param userDetail SecurityContext에서 가져온 사용자 상세 정보
     * @param limit 조회할 게시물 수
     * @param cursor 마지막으로 본 게시물의 createdAt (선택적)
     * @return 피드 응답 DTO
     */

    @GetMapping
    public ResponseEntity<FeedResponseDto> getFeed(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime cursor) {

        FeedResponseDto feed = feedService.getFeed(userDetails, limit, cursor);
        return ResponseEntity.ok(feed);
    }
}
