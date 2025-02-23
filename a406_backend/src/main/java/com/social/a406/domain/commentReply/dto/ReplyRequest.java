package com.social.a406.domain.commentReply.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReplyRequest {
//    private Comment comment;
    private String content;
}
