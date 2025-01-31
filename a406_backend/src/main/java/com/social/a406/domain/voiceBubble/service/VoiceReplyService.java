package com.social.a406.domain.voiceBubble.service;

import com.social.a406.domain.notification.entity.NotificationType;
import com.social.a406.domain.notification.service.NotificationService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.domain.voiceBubble.entity.Voice;
import com.social.a406.domain.voiceBubble.entity.VoiceReply;
import com.social.a406.domain.voiceBubble.repository.VoiceReplyRepository;
import com.social.a406.domain.voiceBubble.repository.VoiceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class VoiceReplyService {

    private final VoiceReplyRepository voiceReplyRepository;
    private final UserRepository userRepository;
    private final VoiceRepository voiceRepository;
    private final S3Client s3Client;
    private final NotificationService notificationService;

    // AWS S3 환경 변수
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    @Value("${cloud.aws.region.static}")
    private String region;

    public List<VoiceReply> findVoiceReplies(Long voiceId) {

        return voiceReplyRepository.findByVoiceVoiceId(voiceId);
    }

    public VoiceReply findVoiceReply(Long voiceReplyId) {
        VoiceReply voiceReply = voiceReplyRepository.findVoiceReplyByVoiceReplyId(voiceReplyId).orElse(null);

        if(voiceReply != null){
            return voiceReply;
        }else{
            throw new IllegalArgumentException("No voices reply found with id: " + voiceReplyId);
        }
    }

    public void deleteVoiceReply(Long voiceReplyId) {
        VoiceReply voiceReply = voiceReplyRepository.findVoiceReplyByVoiceReplyId(voiceReplyId).orElseThrow(
                () -> new IllegalArgumentException("No voices reply found with id: " + voiceReplyId)
        );

        deleteFromS3(voiceReply.getAudioUrl());
        voiceReplyRepository.delete(voiceReply);
    }

    // S3 파일 삭제
    private void deleteFromS3(String audioUrl) {
        // S3 버킷 내에서 삭제하려는 파일의 키(파일 경로) 추출
        String fileKey = audioUrl.substring(audioUrl.indexOf("voicereply/"));  // 'voice/'부터 시작하는 경로 추출

        // S3에서 해당 파일 삭제
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build());

        System.out.println("Deleted file from S3: " + fileKey);
    }

    public String saveVoiceReply(MultipartFile file, String personalId, Long voiceId) {
        try {
            // 유저 존재 여부 확인
            User user = userRepository.findByPersonalId(personalId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Voice voice = voiceRepository.findByVoiceId(voiceId)
                    .orElseThrow(() -> new IllegalArgumentException("Voice not found"));
            if(Objects.equals(user.getId(), voice.getUser().getId())){
                throw new IllegalArgumentException("You can't send yourself a voice reply");
            }

            String fileName = "voicereply/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

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
            VoiceReply voiceReply = voiceReplyRepository.save(new VoiceReply(voice, user, fileUrl));

            generateVoiceReplyNotification(voiceReply);

            return "Success to store the file";
        } catch (IOException e) {
            throw new RuntimeException("Failed to store the file", e);
        }
    }

    private void generateVoiceReplyNotification(VoiceReply voiceReply){
        // 음성 답장
        User receiver = voiceReply.getVoice().getUser();
        User sender = voiceReply.getUser();
        Long referenceId = voiceReply.getVoice().getVoiceId();
        notificationService.createNotification(receiver, sender, NotificationType.VOICEREPLY, referenceId);
        System.out.println("Generate notification about voice reply");
    }
}
