package com.social.a406.domain.user.service;

import com.social.a406.domain.follow.repository.FollowRepository;
import com.social.a406.domain.interest.entity.Interest;
import com.social.a406.domain.interest.entity.UserInterest;
import com.social.a406.domain.interest.repository.InterestRepository;
import com.social.a406.domain.interest.repository.UserInterestRepository;
import com.social.a406.domain.interest.service.InterestService;
import com.social.a406.domain.user.dto.*;
import com.social.a406.domain.user.entity.EmailVerifyCode;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.EmailVerifyCodeRepository;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.JwtTokenUtil;
import com.social.a406.util.VerifyEmailUtil;
import com.social.a406.util.exception.BadRequestException;
import com.social.a406.util.exception.DuplicateException;
import com.social.a406.util.exception.ForbiddenException;
import com.social.a406.util.exception.UnregisteredUserException;
import jakarta.persistence.Tuple;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserInterestRepository userInterestRepository;
    private final InterestRepository interestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final CustomUserDetailsService customUserDetailsService;
    private final S3Client s3Client;
    private final EmailVerifyCodeRepository emailVerifyCodeRepository;
    private final VerifyEmailUtil verifyEmailUtil;
    private final FollowRepository followRepository;

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
            throw new ForbiddenException("Unsupported registration type");
        }
    }

    private void handleNormalUserRegistration(UserRegistrationRequest request, MultipartFile file) {
        if (existsByEmail(request.getEmail())) {
            log.warn("Registration failed. Email already exists: {}", request.getEmail());
            throw new DuplicateException("Email already exists");
        }

        if (existsByPersonalId(request.getPersonalId())) {
            log.warn("Registration failed. personalId duplicate: {}", request.getPersonalId());
            throw new DuplicateException("personalId duplicate");
        }
        String profileImageUrl = null;
        if(file != null) {
            profileImageUrl = saveProfileImageAtS3(file);
        }
        User newUser = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .personalId(request.getPersonalId())
                .profileImageUrl(profileImageUrl)
                .birthDate(request.getBirthDate())
                .introduction(request.getIntroduction())
                .build();

        userRepository.save(newUser);
        log.info("User registered successfully: {}", request.getEmail());
    }

    private void handleSocialUserRegistration(SocialUserRegistrationRequest request, MultipartFile file) {
        if (userRepository.existsBySocialDomainAndSocialId(request.getSocialDomain(), request.getSocialId())) {
            log.warn("Registration failed. Social ID already exists: {} {}", request.getSocialDomain(), request.getSocialId());
            throw new DuplicateException("Social ID already exists");
        }

        if (userRepository.existsByPersonalId(request.getPersonalId())) {
            log.warn("Registration failed. personalId duplicate: {}", request.getPersonalId());
            throw new DuplicateException("personalId duplicate");
        }

        String profileImageUrl = null;
        if(file != null) {
            profileImageUrl = saveProfileImageAtS3(file);
        }
        User newUser = User.builder()
                .socialDomain(request.getSocialDomain())
                .socialId(request.getSocialId())
                .name(request.getName())
                .personalId(request.getPersonalId())
                .email(request.getEmail())
                .profileImageUrl(profileImageUrl)
                .birthDate(request.getBirthDate())
                .introduction(request.getIntroduction())
                .build();

        userRepository.save(newUser);
        log.info("Social user registered successfully: {} {}", request.getSocialDomain(), request.getSocialId());
    }

    // 사용자 존재 여부 확인
    public boolean existsByEmail(String Email) {
        return userRepository.existsByEmail(Email);
    }

    public boolean existsByPersonalId(String personalId) {
        return userRepository.existsByPersonalId(personalId);
    }

    public Map<String, String> login(UserLoginRequest userLoginRequest) {
        String loginIdentifier = userLoginRequest.getEmailOrPersonalId();
        UserDetails userDetails;

        // "@"가 포함되어 있으면 이메일, 그렇지 않으면 퍼스널 ID로 처리
        if (loginIdentifier.contains("@")) {
            userDetails = customUserDetailsService.loadUserByEmail(loginIdentifier);
        } else {
            userDetails = customUserDetailsService.loadUserByPersonalId(loginIdentifier);
        }

        // 사용자 검증
        validateUser(userDetails, userLoginRequest.getPassword());

        // JWT 토큰 생성
        String accessToken = jwtTokenUtil.generateToken(userDetails);
        String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);

        // AccessToken과 RefreshToken을 Map으로 반환
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("personalId", userDetails.getUsername());

        return tokens;
    }

    // 사용자 비밀번호 및 존재 여부 검증 메서드
    private void validateUser(UserDetails userDetails, String rawPassword) {
        if (userDetails == null) {
            log.warn("Login failed. User not found with Email: {}", rawPassword);
            throw new UnregisteredUserException("Email does not exist");
        }

        if (!passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
            log.warn("Invalid password for user: {}", userDetails.getUsername());
            throw new UnregisteredUserException("Invalid password");
        }
    }

    public UserCharacterResponse getMyInfoByPersonalId(String personalId) {
        // UserRepository에서 닉네임으로 사용자 조회
        Tuple result = userRepository.findUserFollowInfoByPersonalId(personalId);

        // 사용자 정보가 존재할 경우 UserCharacterResponse로 변환
        if (result != null) {
            return mapToResponseDto(result,false);
        }
        // 닉네임에 해당하는 사용자가 없을 경우 예외 발생
        throw new ForbiddenException("User or AI not found for personalId: " + personalId);
    }

    public UserCharacterResponse getUserInfoByPersonalId(String myPersonalId, String personalId) {
        // UserRepository에서 닉네임으로 사용자 조회
        Tuple result = userRepository.findUserFollowInfoByPersonalId(personalId);

        // 사용자 정보가 존재할 경우 UserCharacterResponse로 변환
        if (result != null) {
            boolean isFollow = false;
            if(!myPersonalId.equals(personalId)){
                isFollow = followRepository.existsByFollowee_PersonalIdAndFollower_PersonalId(personalId, myPersonalId);
                System.out.println(isFollow);
            }
            return mapToResponseDto(result,isFollow);
        }
        // 닉네임에 해당하는 사용자가 없을 경우 예외 발생
        throw new ForbiddenException("User or AI not found for personalId: " + personalId);
    }

    public UserCharacterResponse mapToResponseDto(Tuple result, boolean isFollow){
        return UserCharacterResponse.builder()
                .type(result.get("hasMainPrompt", Boolean.class)? "ai" : "user")
                .id(result.get("id", String.class))
                .name(result.get("name", String.class))
                .personalId(result.get("personalId", String.class))
                .profileImageUrl(result.get("profileImageUrl", String.class))
                .introduction(result.get("introduction", String.class))
                .birthDate(result.get("birthDate").toString())
                .followerCount(result.get("followerCount", Long.class))
                .followeeCount(result.get("followeeCount", Long.class))
                .isFollow(isFollow)
                .build();
    }

    public User getUserByPersonalId(String personalId) {
        // UserRepository에서 닉네임으로 사용자 조회
        return userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("User or AI not found for personalId: " + personalId));
    }

    // AI 유저 반환
    public String getRandomUserWithMainPrompt() {
        // 한 개의 결과만 가져오기
        Pageable pageable = PageRequest.of(0, 1);
        List<User> users = userRepository.findUsersWithMainPrompt(pageable);

        if (users.isEmpty()) {
            throw new RuntimeException("No user with mainPrompt found");
        }

        // 첫 번째 사용자 반환
        return users.get(0).getPersonalId();
    }

    // 동일한 관심사 가진 랜덤 AI유저 조회
    public String getRandomUserWithMatchingInterest(String personalId) {
        // 관심사 전체 조회
        List<Long> interestIds = getInterestIdsByPersonalId(personalId);

        // 관심사와 일치하는 사용자 목록 조회
        List<String> userPersonalIds = getUserPersonalIdsByInterestIds(interestIds);

        // 랜덤 사용자 선택
        return selectRandomUser(userPersonalIds);
    }

    // 해당 personalId 유저의 모든 관심사 조회
    private List<Long> getInterestIdsByPersonalId(String personalId) {
        List<Long> interestIds = userInterestRepository.findIdsByPersonalId(personalId);

        if (interestIds.isEmpty()) {
            System.err.println("No interests found for user with personalId: " + personalId);
        }

        return interestIds;
    }

    // 관심사 ID 목록으로 사용자 ID 목록 조회
    private List<String> getUserPersonalIdsByInterestIds(List<Long> interestIds) {
        if (interestIds.isEmpty()) {
            return List.of();
        }

        List<String> userPersonalIds = userInterestRepository.findUserPersonalIdsByInterestIdsAndNonNullPrompt(interestIds);

        if (userPersonalIds.isEmpty()) {
            System.err.println("No suitable users found for the given interests.");
        }

        return userPersonalIds;
    }

    // 랜덤 사용자 선택
    private String selectRandomUser(List<String> userPersonalIds) {
        if (userPersonalIds.isEmpty()) {
            return null;
        }

        return userPersonalIds.get(ThreadLocalRandom.current().nextInt(userPersonalIds.size()));
    }

    // 동일한 관심사 가진 랜덤 일반 유저 조회
    public String getRandomUserWithMatchingInterestWithUnfollow(String personalId) {
        // 관심사 전체 조회
        List<Long> interestIds = getInterestIdsByPersonalId(personalId);

        // 관심사와 일치하는 사용자 목록 조회
        List<String> userPersonalIds = getUserPersonalIdsByInterestIdsWithUnfollow(interestIds, personalId);

        // 랜덤 사용자 선택
        return selectRandomUser(userPersonalIds);
    }

    // 관심사 ID 목록으로 팔로우 하지 않은 사용자 ID 목록 조회
    private List<String> getUserPersonalIdsByInterestIdsWithUnfollow(List<Long> interestIds, String personalId) {
        if (interestIds.isEmpty()) {
            return List.of();
        }

        List<String> userPersonalIds = userInterestRepository.findUserPersonalIdsByInterestIdsExcludingFollowed(interestIds, personalId);

        if (userPersonalIds.isEmpty()) {
            System.err.println("No suitable users found for follow");
        }

        return userPersonalIds;
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

            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileName;
        } catch(IOException e){
            throw new BadRequestException("Failed to store the file");
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
    private void deleteProfileImageFromS3(String profileImageUrl) {
        // S3 버킷 내에서 삭제하려는 파일의 키(파일 경로) 추출
        String fileKey = profileImageUrl.substring(profileImageUrl.indexOf("profile/"));  // 'profile/'부터 시작하는 경로 추출

        // S3에서 해당 파일 삭제
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build());

        System.out.println("Deleted file from S3: " + fileKey);
    }

    // 비밀번호 변경 - 이메일 코드 보내기
    public String sendEmailCode(EmailRequest emailRequest){
        User user = checkEmailAndPersonalId(emailRequest);

        //이메일 전송 로직
        String verifyCode = VerifyEmailUtil.generateVerificationCode();
        saveVerifyCode(user, verifyCode);

        return verifyEmailUtil.sendEmail(user.getEmail(), verifyCode);
    }

    public User checkEmailAndPersonalId(EmailRequest emailRequest){
        User userEmail = userRepository.findByEmail(emailRequest.getEmail()).orElseThrow(
                ()->new ForbiddenException("User Not found with email : " + emailRequest.getEmail())
        );
        User userPersonalId = userRepository.findByPersonalId(emailRequest.getPersonalId()).orElseThrow(
                () -> new ForbiddenException("User Not found with personalId : " + emailRequest.getPersonalId())
        );

        if(userEmail != userPersonalId){
            throw new UnregisteredUserException("Not matched email and personalId");
        }
        return userEmail;
    }

    public void saveVerifyCode(User user, String verifyCode){
        EmailVerifyCode emailVerifyCode = EmailVerifyCode.builder()
                .user(user)
                .verifyCode(verifyCode)
                .build();
        emailVerifyCodeRepository.save(emailVerifyCode);
    }

    // 비밀번호 변경 - 이메일 코드 인증
    public String verifyEmailcode(EmailVerifyRequest emailVerifyRequest) {
        User user = userRepository.findByEmail(emailVerifyRequest.getEmail()).orElseThrow(
                () -> new ForbiddenException("User Not found with email : " + emailVerifyRequest.getEmail())
        );
        final boolean isValidVerifyCode = emailVerifyCodeRepository.findByUserId(user.getId(), emailVerifyRequest.getCode(), LocalDateTime.now());
        if (isValidVerifyCode) {
            return "Email verification successful!!";
        } else {
            throw new ForbiddenException("Email verification fail!!");
        }
    }

    //비밀번호 변경
    public String changeUserPassword(UserPasswordRequset userPasswordRequest) {
        User user = userRepository.findByEmail(userPasswordRequest.getEmail()).orElseThrow(
                () -> new ForbiddenException("User Not found with email : " + userPasswordRequest.getEmail())
        );
        user.updatePassword(passwordEncoder.encode(userPasswordRequest.getPassword()));
        userRepository.save(user);
        return "Password change success!!";
    }

    public UserSearchResponse searchUser(Pageable pageable, String cursorId, String word) {
        List<User> users = userRepository.searchUsers(word, cursorId, pageable);
        List<UserInfoResponse> responses = users.stream()
                .map(user -> UserInfoResponse.builder()
                        .personalId(user.getPersonalId())
                        .profileImageUrl(user.getProfileImageUrl())
                        .name(user.getName())
                        .build()
                ).toList();
        String lstCursor = responses.isEmpty() ? null : responses.get(responses.size()-1).getPersonalId();
        return UserSearchResponse.builder()
                .cursorId(lstCursor)
                .responses(responses)
                .build();
    }

    @Transactional
    public void updateUser(String personalId, UserUpdateRequest userUpdateRequest, MultipartFile file) {
        User user = userRepository.findByPersonalId(personalId).orElseThrow(
                ()-> new ForbiddenException("Not found user"));

        user.updateUserProfile(userUpdateRequest.getName(), userUpdateRequest.getIntroduction());
        userInterestRepository.deleteByUser_Id(user.getId());
        if(!userUpdateRequest.getInterests().isEmpty()){
            // 관심사 리스트를 DB에서 가져오거나, 존재하지 않으면 새로 추가
            List<Interest> interests = userUpdateRequest.getInterests().stream()
                    .map(content -> interestRepository.findByContent(content)
                            .orElseGet(() -> interestRepository.save(new Interest(content))))
                    .toList();

            // UserInterest 저장
            List<UserInterest> userInterests = interests.stream()
                    .map(interest -> new UserInterest(user, interest))
                    .toList();

            userInterestRepository.saveAll(userInterests);
        }
        if(file != null){
            if(user.getProfileImageUrl() != null) {
                deleteProfileImageFromS3(user.getProfileImageUrl());
            }
            String newProfileImageUrl = saveProfileImageAtS3(file);
            user.updateUserProfileImage(newProfileImageUrl);
        }
    }

    public void checkDuplicateEmail(String email) {
        if (existsByEmail(email)) {
            throw new DuplicateException("Somebody is already using this email.");
        }
    }

    public void checkDuplicatePersonalId(String personalId) {
        if (existsByPersonalId(personalId)) {
            throw new DuplicateException("This nickname is already taken.");
        }
    }

    public void oauthRegistCheck(String socialId) {
        if(!userRepository.existsBySocialId(socialId)){
            throw new UnregisteredUserException("You need registration first");
        }
    }
}
