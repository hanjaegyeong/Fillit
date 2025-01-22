package com.social.a406.domain.user.service;

import com.social.a406.domain.user.dto.*;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final CustomUserDetailsService customUserDetailsService;
    private final S3Client s3Client;

    // AWS S3 환경 변수
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    @Value("${cloud.aws.region.static}")
    private String region;

    // 회원 가입 메서드
    public void registerUser(RegistrationRequest registrationRequest, MultipartFile file) {
        if (registrationRequest instanceof UserRegistrationRequest userRequest) {
            // 일반 회원가입 처리
            handleNormalUserRegistration(userRequest, file);
        } else if (registrationRequest instanceof SocialUserRegistrationRequest socialRequest) {
            // 소셜 회원가입 처리
            handleSocialUserRegistration(socialRequest, file);
        } else {
            throw new IllegalArgumentException("Unsupported registration type");
        }
    }

    private void handleNormalUserRegistration(UserRegistrationRequest request, MultipartFile file) {
        if (existsByLoginId(request.getLoginId())) {
            log.warn("Registration failed. Login ID already exists: {}", request.getLoginId());
            throw new IllegalArgumentException("Login ID already exists");
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            log.warn("Registration failed. Nickname duplicate: {}", request.getNickname());
            throw new IllegalArgumentException("Nickname duplicate");
        }
        String profileImageUrl = null;
        if(file != null) {
            profileImageUrl = saveProfileImageAtS3(file);
        }
        User newUser = User.builder()
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .nickname(request.getNickname())
                .email(request.getEmail())
                .profileImageUrl(profileImageUrl)
                .birthDate(request.getBirthDate())
                .introduction(request.getIntroduction())
                .build();

        userRepository.save(newUser);
        log.info("User registered successfully: {}", request.getLoginId());
    }

    private void handleSocialUserRegistration(SocialUserRegistrationRequest request, MultipartFile file) {
        if (userRepository.existsBySocialDomainAndSocialId(request.getSocialDomain(), request.getSocialId())) {
            log.warn("Registration failed. Social ID already exists: {} {}", request.getSocialDomain(), request.getSocialId());
            throw new IllegalArgumentException("Social ID already exists");
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            log.warn("Registration failed. Nickname duplicate: {}", request.getNickname());
            throw new IllegalArgumentException("Nickname duplicate");
        }

        String profileImageUrl = null;
        if(file != null) {
            profileImageUrl = saveProfileImageAtS3(file);
        }
        User newUser = User.builder()
                .socialDomain(request.getSocialDomain())
                .socialId(request.getSocialId())
                .name(request.getName())
                .nickname(request.getNickname())
                .email(request.getEmail())
                .profileImageUrl(profileImageUrl)
                .birthDate(request.getBirthDate())
                .introduction(request.getIntroduction())
                .build();

        userRepository.save(newUser);
        log.info("Social user registered successfully: {} {}", request.getSocialDomain(), request.getSocialId());
    }

    // 사용자 존재 여부 확인
    public boolean existsByLoginId(String loginId) {
        return userRepository.existsByLoginId(loginId);
    }

    public Map<String, String> login(UserLoginRequest userLoginRequest) {
        UserDetails userDetails = customUserDetailsService.loadUserByLoginId(userLoginRequest.getLoginId());

        // 사용자 검증
        validateUser(userDetails, userLoginRequest.getPassword());

        // JWT 토큰 생성
        String accessToken = jwtTokenUtil.generateToken(userDetails);
        String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);

        // AccessToken과 RefreshToken을 Map으로 반환
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens;
    }

    // 사용자 비밀번호 및 존재 여부 검증 메서드
    private void validateUser(UserDetails userDetails, String rawPassword) {
        if (userDetails == null) {
            log.warn("Login failed. User not found with login ID: {}", rawPassword);
            throw new RuntimeException("Login ID does not exist");
        }

        if (!passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
            log.warn("Invalid password for user: {}", userDetails.getUsername());
            throw new RuntimeException("Invalid password");
        }
    }

    public UserCharacterResponse getUserInfoByNickname(String nickname) {
        // UserRepository에서 닉네임으로 사용자 조회
        Optional<User> userOptional = userRepository.findByNickname(nickname);

        // 사용자 정보가 존재할 경우 UserCharacterResponse로 변환
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return UserCharacterResponse.builder()
                    .type(user.getLoginId() == null && user.getPassword() == null ? "ai" : "user")
                    .id(user.getId())
                    .name(user.getName())
                    .nickname(user.getNickname())
                    .profileImageUrl(user.getProfileImageUrl())
                    .introduction(user.getIntroduction())
                    .birthDate(user.getBirthDate() != null ? user.getBirthDate().toString() : null)
                    .build();
        }

        // 닉네임에 해당하는 사용자가 없을 경우 예외 발생
        throw new IllegalArgumentException("User or AI not found for nickname: " + nickname);
    }

    public User getUserByNickname(String nickname) {
        // UserRepository에서 닉네임으로 사용자 조회
        return userRepository.findByNickname(nickname)
                .orElseThrow(() -> new IllegalArgumentException("User or AI not found for nickname: " + nickname));
    }

    //이미지 저장
    public String saveProfileImageAtS3(MultipartFile file) {
        try{
            String fileName = "profile/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

            // 이미지의 MIME 타입 추출
            String contentType = getContentType(file.getOriginalFilename());

            // S3 업로드
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .contentType(contentType)
                .contentDisposition("inline")
                .build();

            s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(
                    file.getInputStream(), file.getSize()));

            String fileUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileName;

            return fileUrl;
        } catch(IOException e){
            throw new RuntimeException("Failed to store the file", e);
        }
    }
    // 파일 확장자에 맞는 MIME 타입을 반환하는 메서드
    private String getContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "webp":
                return "image/webp";
            default:
                return "application/octet-stream"; // 기본 값
        }
    }

    // 이미지 삭제
    // S3 파일 삭제
    private void deleteProfilImageFromS3(String audioUrl) {
        // S3 버킷 내에서 삭제하려는 파일의 키(파일 경로) 추출
        String fileKey = audioUrl.substring(audioUrl.indexOf("profile/"));  // 'profile/'부터 시작하는 경로 추출

        // S3에서 해당 파일 삭제
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build());

        System.out.println("Deleted file from S3: " + fileKey);
    }
}
