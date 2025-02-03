package com.social.a406.domain.feed.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class FeedResponseDto {
    private List<PostDto> posts;
    private LocalDateTime nextCursor;

    public FeedResponseDto(List<PostDto> posts, LocalDateTime nextCursor) {
        this.posts = posts;
        this.nextCursor = nextCursor;
    }
}
