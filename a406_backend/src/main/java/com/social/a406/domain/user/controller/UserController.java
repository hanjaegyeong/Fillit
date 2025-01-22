package com.social.a406.domain.user.controller;

import com.social.a406.domain.user.dto.RegistrationRequest;
import com.social.a406.domain.user.dto.UserCharacterResponse;
import com.social.a406.domain.user.dto.UserLoginRequest;
import com.social.a406.domain.user.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // refresh token 수명
    @Value("${refresh.token.max-age}")
    private int refreshTokenMaxage;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestPart("regist") RegistrationRequest registrationRequest,
                                               @RequestPart(value = "profileImage", required = false) MultipartFile file) {
        try {
            userService.registerUser(registrationRequest, file);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserLoginRequest userLoginRequest) {
        try {
            Map<String, String> tokens = userService.login(userLoginRequest);

            // Access Token은 인증 헤더에 세팅
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + tokens.get("accessToken"));

            // Refresh Token은 쿠키에 세팅
            ResponseCookie refreshTokenCookie = createCookie("refreshToken", tokens.get("refreshToken"), refreshTokenMaxage);

            return ResponseEntity.ok()
                    .headers(headers)
                    .header("Set-Cookie", refreshTokenCookie.toString())
                    .body(tokens.get("accessToken")); //추후 "Login successful"로 수정!
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // 쿠키 생성 메서드
    private ResponseCookie createCookie(String name, String value, int maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Strict")
                .build();
    }

    // 유저 조회
    @GetMapping("/{personalId}")
    public ResponseEntity<UserCharacterResponse> getUserInfo(@PathVariable String personalId) {
        UserCharacterResponse response = userService.getUserInfoByPersonalId(personalId);
        return ResponseEntity.ok(response);
    }
}
