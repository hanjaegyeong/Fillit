package com.social.a406.domain.user.service;

import com.social.a406.domain.user.dto.RegistrationRequest;
import com.social.a406.domain.user.dto.SocialUserRegistrationRequest;
import com.social.a406.domain.user.dto.UserRegistrationRequest;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        User newUser = new User();
        newUser.setLoginId(request.getLoginId());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setName(request.getName());
        newUser.setNickname(request.getNickname());
        newUser.setAge(request.getAge());
        newUser.setEmail(request.getEmail());
        newUser.setProfileImageUrl(request.getProfileImageUrl());
        newUser.setIntroduction(request.getIntroduction());

        userRepository.save(newUser);
        log.info("User registered successfully: {}", request.getLoginId());
    }

    private void handleSocialUserRegistration(SocialUserRegistrationRequest request) {
        // UserRepository의 existsBySocialDomainAndSocialId 메서드 호출
        if (userRepository.existsBySocialDomainAndSocialId(request.getSocialDomain(), request.getSocialId())) {
            log.warn("Registration failed. Social ID already exists: {} {}", request.getSocialDomain(), request.getSocialId());
            throw new IllegalArgumentException("Social ID already exists");
        }

        User newUser = new User();
        newUser.setSocialDomain(request.getSocialDomain());
        newUser.setSocialId(request.getSocialId());
        newUser.setName(request.getName());
        newUser.setNickname(request.getNickname());
        newUser.setAge(request.getAge());
        newUser.setEmail(request.getEmail());
        newUser.setProfileImageUrl(request.getProfileImageUrl());
        newUser.setIntroduction(request.getIntroduction());

        userRepository.save(newUser);
        log.info("Social user registered successfully: {} {}", request.getSocialDomain(), request.getSocialId());
    }

    // 사용자 존재 여부 확인
    public boolean existsByLoginId(String loginId) {
        return userRepository.existsByLoginId(loginId);
    }
}
