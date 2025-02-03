package com.social.a406.domain.voiceBubble.dto;

public record VoiceResponse(
    Long voiceId,
    String personalId,
    String profileImageUrl,
    String audioUrl
) {
}
