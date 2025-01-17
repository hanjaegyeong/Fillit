package com.social.a406.domain.user.service;

import com.social.a406.domain.character.repository.CharacterRepository;
import com.social.a406.domain.user.dto.*;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.social.a406.domain.character.entity.Character;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final CharacterRepository characterRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final CustomUserDetailsService customUserDetailsService;

    // 회원 가입 메서드
    public void registerUser(RegistrationRequest registrationRequest) {
        if (registrationRequest instanceof UserRegistrationRequest userRequest) {
            // 일반 회원가입 처리
            handleNormalUserRegistration(userRequest);
        } else if (registrationRequest instanceof SocialUserRegistrationRequest socialRequest) {
            // 소셜 회원가입 처리
            handleSocialUserRegistration(socialRequest);
        } else {
            throw new IllegalArgumentException("Unsupported registration type");
        }
    }

    private void handleNormalUserRegistration(UserRegistrationRequest request) {
        if (existsByLoginId(request.getLoginId())) {
            log.warn("Registration failed. Login ID already exists: {}", request.getLoginId());
            throw new IllegalArgumentException("Login ID already exists");
        }

        User newUser = User.builder()
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .nickname(request.getNickname())
                .email(request.getEmail())
                .profileImageUrl(request.getProfileImageUrl())
                .introduction(request.getIntroduction())
                .build();

        userRepository.save(newUser);
        log.info("User registered successfully: {}", request.getLoginId());
    }

    private void handleSocialUserRegistration(SocialUserRegistrationRequest request) {
        if (userRepository.existsBySocialDomainAndSocialId(request.getSocialDomain(), request.getSocialId())) {
            log.warn("Registration failed. Social ID already exists: {} {}", request.getSocialDomain(), request.getSocialId());
            throw new IllegalArgumentException("Social ID already exists");
        }

        User newUser = User.builder()
                .socialDomain(request.getSocialDomain())
                .socialId(request.getSocialId())
                .name(request.getName())
                .nickname(request.getNickname())
                .email(request.getEmail())
                .profileImageUrl(request.getProfileImageUrl())
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
        // 실제 유저 조회
        Optional<User> user = userRepository.findByNickname(nickname);
        if (user.isPresent()) {
            User u = user.get();
            return UserCharacterResponse.builder()
                    .type("user")
                    .id(u.getId())
                    .name(u.getName())
                    .nickname(u.getNickname())
                    .profileImageUrl(u.getProfileImageUrl())
                    .introduction(u.getIntroduction())
                    .birthDate(u.getBirthDate() != null ? u.getBirthDate().toString() : null)
                    .build();
        }

        // 캐릭터 조회
        Optional<Character> character = characterRepository.findByNickname(nickname);
        if (character.isPresent()) {
            Character c = character.get();
            return UserCharacterResponse.builder()
                    .type("ai")
                    .id(c.getId())
                    .name(c.getName())
                    .nickname(c.getNickname())
                    .profileImageUrl(c.getProfileImageUrl())
                    .introduction(c.getIntroduction())
                    .birthDate(c.getBirthDate() != null ? c.getBirthDate().toString() : null)
                    .build();
        }

        // 유저 또는 캐릭터가 없을 경우 예외 처리
        throw new IllegalArgumentException("User or Character not found for nickname: " + nickname);
    }
}
