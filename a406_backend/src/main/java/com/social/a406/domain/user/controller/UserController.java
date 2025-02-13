package com.social.a406.domain.user.controller;

import com.social.a406.domain.user.dto.*;
import com.social.a406.domain.user.service.UserService;
import com.social.a406.util.RedisService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RedisService redisService;

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
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequest userLoginRequest) {
        try {
            Map<String, String> tokens = userService.login(userLoginRequest);

            // Access Token은 인증 헤더에 세팅
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + tokens.get("accessToken"));

            // Refresh Token은 쿠키에 세팅
            ResponseCookie refreshTokenCookie = createCookie("refreshToken", tokens.get("refreshToken"), refreshTokenMaxage);
            UserLoginResponse response = UserLoginResponse.builder()
                    .accessToken(tokens.get("accessToken"))
                    .personalId(tokens.get("personalId"))
                    .build();

            // Redis에 리프레시 토큰 저장
            redisService.saveRefreshToken(tokens.get("refreshToken"), tokens.get("personalId"));

            return ResponseEntity.ok()
                    .headers(headers)
                    .header("Set-Cookie", refreshTokenCookie.toString())
                    .body(response); //추후 "Login successful"로 수정!
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // 유저 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        // 쿠키에서 Refresh Token 가져오기
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    String refreshToken = cookie.getValue();

                    // Redis에서 Refresh Token 삭제
                    redisService.deleteRefreshToken(refreshToken);

                    // 쿠키 삭제 (브라우저에서도 삭제)
                    Cookie deleteCookie = new Cookie("refreshToken", null);
                    deleteCookie.setMaxAge(0);
                    deleteCookie.setPath("/");
                    response.addCookie(deleteCookie);

                    return ResponseEntity.ok("Logout successful");
                }
            }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No refresh token found");
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
    @GetMapping("/get")
    public ResponseEntity<UserCharacterResponse> getMyInfo(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserCharacterResponse response = userService.getMyInfoByPersonalId(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    // 유저 조회
    @GetMapping("/{personalId}")
    public ResponseEntity<UserCharacterResponse> getUserInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String personalId) {
        UserCharacterResponse response = userService.getUserInfoByPersonalId(userDetails.getUsername() ,personalId);
        return ResponseEntity.ok(response);
    }

    // 유저 프로필 수정
    @PatchMapping("/update")
    public ResponseEntity<String> updateUser(@AuthenticationPrincipal UserDetails userDetails,
                                             @RequestPart("update") UserUpdateRequest userUpdateRequest,
                                             @RequestPart(value = "profileImage",required = false) MultipartFile file){
        userService.updateUser(userDetails.getUsername(), userUpdateRequest, file);
        return ResponseEntity.ok("Success to update profile of " + userDetails.getUsername());
    }

    // 비밀번호 변경 - 이메일 코드 전송
    @PostMapping("/email/send")
    public ResponseEntity<String> sendEmailCode(@RequestBody EmailRequest emailRequest){
        String response = userService.sendEmailCode(emailRequest);

        return ResponseEntity.ok(response);
    }

    // 비밀번호 변경 - 이메일 코드 확인
    @PostMapping("/email/verify")
    public ResponseEntity<String> verifyEmailCode(@RequestBody EmailVerifyRequest emailVerifyRequest){
        String response = userService.verifyEmailcode(emailVerifyRequest);

        return ResponseEntity.ok(response);
    }

    //비밀번호 변경
    @PatchMapping("/password")
    public ResponseEntity<String> changeUserPassword(@RequestBody UserPasswordRequset userPasswordRequest){
        String response = userService.changeUserPassword(userPasswordRequest);

        return ResponseEntity.ok(response);
    }

    // 유저 검색
    // cursorId -> personalId 사전순 검색
    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResponse>> searchUser(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String cursorId,
            @RequestParam(required = false) String word
    ){
        Pageable pageable = PageRequest.of(0,size);
        return ResponseEntity.ok(userService.searchUser(pageable, cursorId, word));
    }

    @PostMapping("/duplicate/email")
    public ResponseEntity<String> checkDuplicateEmail(@RequestBody DuplicateRequest request){
        userService.checkDuplicateEmail(request.getInput());
        return ResponseEntity.ok("This Email is available.");
    }

    @PostMapping("/duplicate/nickname")
    public ResponseEntity<String> checkDuplicatePersonalId(@RequestBody DuplicateRequest request){
        userService.checkDuplicatePersonalId(request.getInput());
        return ResponseEntity.ok("Nickname is available.");
    }

    @PostMapping("/test3")
    public ResponseEntity<String> checkTestController3(){
        return ResponseEntity.ok("Nickname is available.");
    }
}
