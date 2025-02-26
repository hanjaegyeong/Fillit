package com.social.a406.domain.feed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class FeedResponseDto {
    private List<PostDto> posts;
    private LocalDateTime nextCursor;
    private LocalDateTime nextCursorRecommend;

}
