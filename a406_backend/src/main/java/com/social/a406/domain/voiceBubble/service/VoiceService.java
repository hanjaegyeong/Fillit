package com.social.a406.domain.voiceBubble.service;

import com.social.a406.domain.follow.entity.Follow;
import com.social.a406.domain.follow.repository.FollowRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.domain.voiceBubble.entity.Voice;
import com.social.a406.domain.voiceBubble.repository.VoiceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class VoiceService {

    private final VoiceRepository voiceRepository;
    private final UserRepository userRepository;
    private final S3Client s3Client;
    private final FollowRepository followRepository;

    @Autowired
    public VoiceService(VoiceRepository voiceRepository, UserRepository userRepository, S3Client s3Client, FollowRepository followRepository) {
        this.voiceRepository = voiceRepository;
        this.userRepository = userRepository;
        this.s3Client = s3Client;
        this.followRepository = followRepository;
    }

    // AWS S3 환경 변수
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    @Value("${cloud.aws.region.static}")
    private String region;

    // 음성 스토리 업로드
    public String saveVoice(MultipartFile file, String nickname) {
        try {
            // 유저 존재 여부 확인
            User user = userRepository.findByNickname(nickname)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            String fileName = "voice/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

            // S3 업로드
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .acl("public-read")  // 퍼블릭 읽기 권한 부여
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(
                    file.getInputStream(), file.getSize()));

            String fileUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileName;

            // Voice 객체 생성 및 DB에 저장
            Voice voice = new Voice(user, fileUrl);
            voiceRepository.save(voice);

            return "File uploaded successfully";
        } catch (IOException e) {
            throw new RuntimeException("Failed to store the file", e);
        }
    }

    // 팔로워들 음성 스토리 리스트 가져오기
    public List<Voice> findFollwerVoices(String nickname) {
        User user = userRepository.findByNickname(nickname).orElse(null);
        List<Follow> followers = followRepository.findByFollower(user);
        List<User> users = followers.stream().map(follow -> follow.getFollower())  // follower의 follower를 가져옴
                .collect(Collectors.toList());
        List<Voice> voices = voiceRepository.findAllByUserIdInOrderByCreatedAtDesc(users);

        return voices;
    }

    // 음성 스토리 삭제
    public void deleteVoice(Long voiceId) {
        Voice voice = voiceRepository.findById(voiceId).orElse(null);
        if (voice != null) {
            deleteFromS3(voice.getAudioUrl());
            voiceRepository.delete(voice);  // 해당 유저의 모든 음성 삭제
        } else {
            throw new IllegalArgumentException("No voices found for voice with id: " + voiceId);
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

    public Voice findVoice(String nickname) {
        Voice voice = voiceRepository.findByUserNickname(nickname).orElse(null);

        if(voice != null){
            return voice;
        }else{
            throw new IllegalArgumentException("Voice not found for user with nickname: " + nickname);
        }
    }

}
