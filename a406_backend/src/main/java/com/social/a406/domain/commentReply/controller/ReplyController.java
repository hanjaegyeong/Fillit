package com.social.a406.domain.commentReply.controller;

import com.social.a406.domain.ai.scheduler.AiScheduler;
import com.social.a406.domain.commentReply.dto.ReplyRequest;
import com.social.a406.domain.commentReply.dto.ReplyResponse;
import com.social.a406.domain.commentReply.service.ReplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board/{boardId}/comment/{commentId}/replies")
@RequiredArgsConstructor
public class ReplyController {

    private final ReplyService replyService;
    private final AiScheduler aiScheduler;

    @PostMapping
    public ResponseEntity<ReplyResponse> addReply (
            @PathVariable Long commentId,
            @RequestBody ReplyRequest request,
            @AuthenticationPrincipal UserDetails userDetails){
        ReplyResponse response = replyService.saveReply(commentId, request, userDetails.getUsername());

        // 대댓글 자동 생성
        if(replyService.isAIAndRandomCreate(commentId)) {
            aiScheduler.scheduleCommentReplyCreationAtCommentReply(response.getReplyId());
        }
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{replyId}")
    public ResponseEntity<ReplyResponse> updateReply(
            @PathVariable Long replyId,
            @RequestBody ReplyRequest request,
            @AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(
                replyService.updateReply(replyId, request, userDetails));
    }

    @DeleteMapping("/{replyId}")
    public ResponseEntity<String> deleteReply (
            @PathVariable Long replyId,
            @AuthenticationPrincipal UserDetails userDetails){
        replyService.deleteReply(replyId, userDetails);
        return ResponseEntity.ok("Success to delete comment reply");
    }

    @GetMapping
    public ResponseEntity<List<ReplyResponse>> getReplyByComment (@PathVariable Long commentId){
        return ResponseEntity.ok(replyService.getReplyList(commentId));
    }
}
