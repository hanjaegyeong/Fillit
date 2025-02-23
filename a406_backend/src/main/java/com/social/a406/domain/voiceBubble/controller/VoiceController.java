package com.social.a406.domain.voiceBubble.controller;

import com.social.a406.domain.voiceBubble.dto.VoiceListenResponse;
import com.social.a406.domain.voiceBubble.dto.VoiceResponse;
import com.social.a406.domain.voiceBubble.entity.Voice;
import com.social.a406.domain.voiceBubble.service.VoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/voice")
@RequiredArgsConstructor
public class VoiceController {

    private final VoiceService voiceService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadVoice(@RequestParam("file") MultipartFile file,
                                              @AuthenticationPrincipal UserDetails userDetails){

        return ResponseEntity.ok(voiceService.saveVoice(file, userDetails.getUsername()));
    }

    // 내 음성 다시 듣기
    @GetMapping("/listen")
    public ResponseEntity<VoiceListenResponse> listenVoice(@AuthenticationPrincipal UserDetails userDetails){
        VoiceListenResponse response = voiceService.findVoice(userDetails.getUsername());

        return ResponseEntity.ok(response);
    }

    // 팔로워 음성 듣기
    @GetMapping("/{voiceId}/listen")
    public ResponseEntity<String> listenFllowerVoice(@AuthenticationPrincipal UserDetails userDetails,
                                                     @PathVariable Long voiceId){
        voiceService.listenFollowerVoice(userDetails.getUsername(), voiceId);
        return ResponseEntity.ok("Listen Follower's voice");
    }

    // 팔로위들 음성 스토리 가져오기
    @GetMapping("/list")
    public ResponseEntity<List<VoiceResponse>> getListVoices(@AuthenticationPrincipal UserDetails userDetails){
        List<VoiceResponse> responses = voiceService.findFollweeVoices(userDetails.getUsername());
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{voiceId}")
    public ResponseEntity<Void> deleteVoice(@PathVariable Long voiceId){
        voiceService.deleteVoice(voiceId);

        return ResponseEntity.ok().build();
    }

}
