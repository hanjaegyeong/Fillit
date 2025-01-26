package com.social.a406.domain.voiceBubble.dto;

import com.social.a406.domain.voiceBubble.entity.VoiceReply;

public record VoiceReplyResponse(
        Long voiceReplyId,
        String personalId,
        String profileImageUrl,
        String audioUrl

) {
    public VoiceReplyResponse(VoiceReply reply) {
        this(reply.getVoiceReplyId(), reply.getUser().getPersonalId(), reply.getUser().getProfileImageUrl(), reply.getAudioUrl());
    }
}
