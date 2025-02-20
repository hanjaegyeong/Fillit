package com.social.a406.domain.voiceBubble.service;

import com.social.a406.domain.follow.entity.Follow;
import com.social.a406.domain.follow.repository.FollowRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.domain.voiceBubble.dto.VoiceListenResponse;
import com.social.a406.domain.voiceBubble.dto.VoiceReplyResponse;
import com.social.a406.domain.voiceBubble.dto.VoiceResponse;
import com.social.a406.domain.voiceBubble.entity.Voice;
import com.social.a406.domain.voiceBubble.entity.VoiceListen;
import com.social.a406.domain.voiceBubble.entity.VoiceReply;
import com.social.a406.domain.voiceBubble.repository.VoiceListenRepository;
import com.social.a406.domain.voiceBubble.repository.VoiceReplyRepository;
import com.social.a406.domain.voiceBubble.repository.VoiceRepository;
import com.social.a406.util.exception.BadRequestException;
import com.social.a406.util.exception.ForbiddenException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class VoiceService {

    private final VoiceRepository voiceRepository;
    private final UserRepository userRepository;
    private final S3Client s3Client;
    private final FollowRepository followRepository;
    private final VoiceReplyRepository voiceReplyRepository;
    private final VoiceReplyService voiceReplyService;
    private final VoiceListenRepository voiceListenRepository;

    // AWS S3 환경 변수
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    @Value("${cloud.aws.region.static}")
    private String region;

    // 음성 스토리 업로드
    public String saveVoice(MultipartFile file, String personalId) {
        try {
            // 유저 존재 여부 확인
            User user = userRepository.findByPersonalId(personalId)
                    .orElseThrow(() -> new ForbiddenException("User not found"));

            String fileName = "voice/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

            // S3 업로드
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .contentType("audio/wav")
                    .contentDisposition("inline")
                    .build();

            s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(
                    file.getInputStream(), file.getSize()));

            String fileUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileName;

            // Voice 객체 생성 및 DB에 저장
            Voice voice = new Voice(user, fileUrl);
            voiceRepository.save(voice);

            return "File uploaded successfully";
        } catch (IOException e) {
            throw new BadRequestException("Failed to store the file");
        }
    }

    // 팔로워들 음성 스토리 리스트 가져오기
    public List<VoiceResponse> findFollweeVoices(String personalId) {
        User user = userRepository.findByPersonalId(personalId).orElseThrow(
                () -> new ForbiddenException("User not found with personalId: " + personalId));
        List<Follow> follows = followRepository.findByFollower(user);
        List<User> users = follows.stream().map(Follow::getFollowee)  // follower의 followee를 가져옴
                .toList();
        List<String> userIds = users.stream().map(User::getId).collect(Collectors.toList());
        List<Voice> voices = voiceRepository.findAllByUser_IdInAndNotListened(userIds, user.getId());
        List<VoiceResponse> responses = voices.stream()
                .map(voice -> new VoiceResponse(
                        voice.getId(),
                        voice.getUser().getName(),
                        voice.getUser().getPersonalId(),
                        voice.getUser().getProfileImageUrl(),
                        voice.getAudioUrl()
                ))
                .toList();
        return responses;
    }

    // 음성 스토리 삭제
    public void deleteVoice(Long voiceId) {
        Voice voice = voiceRepository.findById(voiceId).orElse(null);
        List<VoiceReply> voiceReplies = voiceReplyRepository.findByVoiceId(voiceId);

        voiceReplies.forEach(
                vr -> voiceReplyService.deleteVoiceReply(vr.getId()));
        if (voice != null) {
            deleteFromS3(voice.getAudioUrl());
            voiceRepository.delete(voice);  // 해당 유저의 모든 음성 삭제
        } else {
            throw new ForbiddenException("No voices found for voice with id: " + voiceId);
        }
    }

    // S3 파일 삭제
    private void deleteFromS3(String audioUrl) {
        // S3 버킷 내에서 삭제하려는 파일의 키(파일 경로) 추출
        String fileKey = audioUrl.substring(audioUrl.indexOf("voice/"));  // 'voice/'부터 시작하는 경로 추출

        // S3에서 해당 파일 삭제
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build());

        System.out.println("Deleted file from S3: " + fileKey);
    }

    public VoiceListenResponse findVoice(String personalId) {
        Voice voice = voiceRepository.findByUserPersonalId(personalId).orElse(null);
        VoiceListenResponse response = null;
        if(voice != null) {
            response = new VoiceListenResponse(
                    voice.getId(),
                    voice.getAudioUrl());
        }

        return response;
    }

    @Transactional
    public void listenFollowerVoice(String personalId, Long voiceId) {
        User user = userRepository.findByPersonalId(personalId).orElseThrow(
                () -> new ForbiddenException("Not found user"));
        Voice voice = voiceRepository.findById(voiceId).orElseThrow(
                ()->new ForbiddenException("Not found voice"));
        try {
            voiceListenRepository.save(VoiceListen.builder()
                    .user(user)
                    .voice(voice)
                    .build());
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("User already listened this voice");
        }
    }
}
