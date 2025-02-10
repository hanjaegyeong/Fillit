package com.social.a406.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
                .registerModule(new JavaTimeModule()) // ✅ LocalDateTime 직렬화 지원
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // ✅ 날짜를 타임스탬프로 저장하지 않도록 설정
    }
}
