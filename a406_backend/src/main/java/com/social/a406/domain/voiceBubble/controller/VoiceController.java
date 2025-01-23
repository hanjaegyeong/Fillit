package com.social.a406.domain.voiceBubble.controller;

import com.social.a406.domain.voiceBubble.dto.VoiceResponse;
import com.social.a406.domain.voiceBubble.entity.Voice;
import com.social.a406.domain.voiceBubble.service.VoiceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/voice")
public class VoiceController {

    private final VoiceService voiceService;

    @Autowired
    public VoiceController(VoiceService voiceService) {
        this.voiceService = voiceService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadVoice(@RequestParam("file") MultipartFile file,
                                              @AuthenticationPrincipal UserDetails userDetails){

        return ResponseEntity.ok(voiceService.saveVoice(file, userDetails.getUsername()));
    }

    @GetMapping("/listen")
    public ResponseEntity<VoiceResponse> listenVoice(@AuthenticationPrincipal UserDetails userDetails){
        Voice voice = voiceService.findVoice(userDetails.getUsername());

        VoiceResponse response = new VoiceResponse(voice.getId(),voice.getAudioUrl());

        return ResponseEntity.ok(response);
    }

    // 팔로워들 음성 스토리 가져오기
    @GetMapping("/list")
    public ResponseEntity<List<VoiceResponse>> getListVoices(@AuthenticationPrincipal UserDetails userDetails){
        List<Voice> voices = voiceService.findFollwerVoices(userDetails.getUsername());

        List<VoiceResponse> responses = voices.stream()
                .map(voice -> new VoiceResponse(
                        voice.getId(),
                        voice.getAudioUrl()
                ))
                .toList();
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{voiceId}")
    public ResponseEntity<Void> deleteVoice(@PathVariable Long voiceId){
        voiceService.deleteVoice(voiceId);

        return ResponseEntity.ok().build();
    }

}
