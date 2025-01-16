package com.social.a406.domain.oauth.controller;

import com.social.a406.domain.oauth.dto.OauthResponse;
import com.social.a406.domain.oauth.dto.OauthUserInfo;
import com.social.a406.domain.oauth.service.OauthService;
import com.social.a406.domain.user.dto.SocialLoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/oauth")
public class OauthController {

    private final OauthService oauthService;

    @Autowired
    public OauthController(OauthService oauthService) {
        this.oauthService = oauthService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> SocialLoginUser(@RequestBody SocialLoginRequest socialLoginRequest) {
        try {
            Map<String, String> tokens = oauthService.socialLogin(socialLoginRequest);

            // Access Token은 인증 헤더에 세팅
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + tokens.get("accessToken"));

            // Refresh Token은 쿠키에 세팅
            ResponseCookie refreshTokenCookie = createCookie("refreshToken", tokens.get("refreshToken"), 7 * 24 * 60 * 60);

            return ResponseEntity.ok()
                    .headers(headers)
                    .header("Set-Cookie", refreshTokenCookie.toString())
                    .body("Login successful");
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

    @PostMapping("/kakao")
    public ResponseEntity<OauthResponse> kakaoLogin(
            @RequestParam("access_token") String code
    ) {
        // 프론트 개발 후 사용
//        final OauthToken token = oauthService.getKakaoToken(code);
        final OauthUserInfo userInfo = oauthService.getKakaoInfo(code);

        final OauthResponse kakaoResponse = OauthResponse.of(userInfo.socialId(),
                                                             userInfo.socialDomain());
        return ResponseEntity.ok(kakaoResponse);
    }

    @PostMapping("/google")
    public ResponseEntity<OauthResponse> googleLogin(
            @RequestParam("access_token") String code
    ) {
        // 프론트 개발 후 사용
//        final OauthToken token = oauthService.getGoogleToken(code);
        final OauthUserInfo userInfo = oauthService.getGoogleInfo(code);

        final OauthResponse googleResponse = OauthResponse.of(userInfo.socialId(),
                                                              userInfo.socialDomain());
        return ResponseEntity.ok(googleResponse);
    }

    @PostMapping("/naver")
    public ResponseEntity<OauthResponse> naverLogin(
            @RequestParam("access_token") String code
    ) {
        // 프론트 개발 후 사용
//        final OauthToken token = oauthService.getNaverToken(code);
        final OauthUserInfo userInfo = oauthService.getNaverInfo(code);

        final OauthResponse naverResponse = OauthResponse.of(userInfo.socialId(),
                                                             userInfo.socialDomain());
        return ResponseEntity.ok(naverResponse);
    }
}
