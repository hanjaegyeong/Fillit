//package com.social.a406.domain.auth.controller;
//
//import com.social.a406.domain.auth.service.AuthService;
//import com.social.a406.util.JwtTokenUtil;
////import com.social.a406.util.RedisService;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/auth")
//public class AuthController {
//    private final JwtTokenUtil jwtTokenUtil;
////    private final RedisService redisService;
//    private final AuthService authService;
//
//    @PostMapping("/reissue")
//    public ResponseEntity<?> reissue(@CookieValue("refreshToken") String refreshToken) {
//
//        // 리프레시 토큰 검증
//        if (jwtTokenUtil.isTokenExpired(refreshToken)) {
//            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Expired refresh token");
//        }
//
//        // Redis에서 리프레시 토큰 확인
//        String personalId = redisService.getValue(refreshToken);
//        if (personalId == null) {
//            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Invalid Refresh token");
//        }
//
//        // 새 액세스 토큰 발급
//        String newAccessToken = authService.createAccessToken(personalId);
//        // Access Token은 인증 헤더에 세팅
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + newAccessToken);
//        return ResponseEntity.ok()
//                .headers(headers)
//                .body(newAccessToken);
//    }
//}
//
