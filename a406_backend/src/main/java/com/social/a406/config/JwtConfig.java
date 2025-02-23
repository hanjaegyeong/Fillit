package com.social.a406.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt") // properties 파일 접두어로 필드 자동 바인딩 (하이픈 기준 Uppercase)
@Data
public class JwtConfig {

    private String secretKey;
    private long accessTokenExpireTime;
    private long refreshTokenExpireTime;
}
