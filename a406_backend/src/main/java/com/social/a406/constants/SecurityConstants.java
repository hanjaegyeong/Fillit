package com.social.a406.constants;

public final class SecurityConstants {
    private SecurityConstants() {} // 인스턴스화 방지

    // 화이트리스트 엔드포인트 (Ant 패턴 사용)
    public static final String[] WHITELIST = {
            "/api/users/login",
            "/api/users/register",
            "/api/users/refresh",
            "/api/users/duplicate/**",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/api/oauth/**",
            "/api/ai/generate/**",
            "/api/users/email/**",
            "/api/users/password",
            "/api/interests/**",
            "/api/auth/reissue",
            "/actuator/prometheus",
            "/ws/**"
    };
}
