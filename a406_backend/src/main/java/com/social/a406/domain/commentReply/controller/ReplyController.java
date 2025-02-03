package com.social.a406.domain.commentReply.controller;

import com.social.a406.domain.commentReply.dto.ReplyRequest;
import com.social.a406.domain.commentReply.dto.ReplyResponse;
import com.social.a406.domain.commentReply.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board/{boardId}/comment/{commentId}/replies")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService replyService;

    @PostMapping
    public ReplyResponse addReply (
            @PathVariable Long commentId,
            @RequestBody ReplyRequest request,
            @AuthenticationPrincipal UserDetails userDetails){
        return replyService.saveReply(commentId, request, userDetails);
    }

    @PutMapping("/{replyId}")
    public ReplyResponse updateReply(
            @PathVariable Long replyId,
            @RequestBody ReplyRequest request,
            @AuthenticationPrincipal UserDetails userDetails){
        return replyService.updateReply(replyId, request, userDetails);
    }

    @DeleteMapping("/{replyId}")
    public void deleteReply (
            @PathVariable Long replyId,
            @AuthenticationPrincipal UserDetails userDetails){
        replyService.deleteReply(replyId, userDetails);
    }

    @GetMapping
    public List<ReplyResponse> getReplyByComment (@PathVariable Long commentId){
        return replyService.getReplyList(commentId);
    }
}
