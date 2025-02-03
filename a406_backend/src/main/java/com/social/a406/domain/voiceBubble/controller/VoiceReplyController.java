package com.social.a406.domain.voiceBubble.controller;

import com.social.a406.domain.voiceBubble.dto.VoiceReplyResponse;
import com.social.a406.domain.voiceBubble.entity.Voice;
import com.social.a406.domain.voiceBubble.entity.VoiceReply;
import com.social.a406.domain.voiceBubble.service.VoiceReplyService;
import com.social.a406.domain.voiceBubble.service.VoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/voice/reply")
@RequiredArgsConstructor
public class VoiceReplyController {

    private final VoiceReplyService voiceReplyService;
    private final VoiceService voiceService;

    //답장 저장
    @PostMapping("/upload")
    public ResponseEntity<String> saveVoiceReply(@RequestParam("file") MultipartFile file,
                                                 @AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestParam("voiceId") Long voiceId){

        return ResponseEntity.ok(voiceReplyService.saveVoiceReply(file, userDetails.getUsername(), voiceId));
    }


    //답장 조회
    @GetMapping
    public ResponseEntity<List<VoiceReplyResponse>> findVoiceReply(@AuthenticationPrincipal UserDetails userDetails){
        Voice voice = voiceService.findVoice(userDetails.getUsername());

        List<VoiceReply> voiceReplies = voiceReplyService.findVoiceReplies(voice.getId());

        List<VoiceReplyResponse> responses = voiceReplies.stream()
                .map(VoiceReplyResponse::new)
                .toList();
        return ResponseEntity.ok(responses);
    }

    //답장 듣기
    @GetMapping("/listen/{voiceReplyId}")
    public ResponseEntity<VoiceReplyResponse> listenReply(@PathVariable Long voiceReplyId){
        VoiceReply voiceReply = voiceReplyService.findVoiceReply(voiceReplyId);

        VoiceReplyResponse response = new VoiceReplyResponse(voiceReply);

        return ResponseEntity.ok(response);
    }

    //답장 삭제
    @DeleteMapping("/{voiceReplyId}")
    public ResponseEntity<Void> deleteVoiceReply(@PathVariable Long voiceReplyId){
        voiceReplyService.deleteVoiceReply(voiceReplyId);

        return ResponseEntity.ok().build();
    }

}
