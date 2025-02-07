package com.social.a406.domain.commentReply.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReplyResponse {
    private Long replyId;
//    private Long commentId;
    private String personalId;
    private String profileImageUrl;
    private String content;
    private Long likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
 }
