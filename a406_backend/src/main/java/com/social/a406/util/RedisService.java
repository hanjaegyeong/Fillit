//package com.social.a406.util;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.redis.core.StringRedisTemplate;
//import org.springframework.stereotype.Service;
//
//import java.time.Duration;
//
//@Service
//@RequiredArgsConstructor
//public class RedisService {
//    private final StringRedisTemplate redisTemplate;
//
//    // 리프레시 토큰 저장
//    public void saveRefreshToken(String refreshToken, String personalId) {
//        // 리프레시 토큰을 Redis에 저장 (토큰: 사용자 ID 형태로 저장)
//        redisTemplate.opsForValue().set(refreshToken, personalId, Duration.ofDays(7));  // 7일 동안 유효
//    }
//
//    // 리프레시 토큰을 통해 사용자 ID 조회
//    public String getValue(String refreshToken) {
//        return redisTemplate.opsForValue().get(refreshToken);
//    }
//
//    // 리프레시 토큰 삭제
//    public void deleteRefreshToken(String refreshToken) {
//        redisTemplate.delete(refreshToken);
//    }
//}