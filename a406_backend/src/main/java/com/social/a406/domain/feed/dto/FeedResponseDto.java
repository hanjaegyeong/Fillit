package com.social.a406.domain.feed.dto;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
public class FeedResponseDto {
    private final List<PostDto> posts;
    private final LocalDateTime nextCursor;



    // getters and setters
}
