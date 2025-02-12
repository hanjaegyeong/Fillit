package com.social.a406.config;

import org.redisson.api.RedissonClient;
import org.redisson.client.codec.StringCodec;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    /**
     * Spring Data Redis (Lettuce) 설정
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory("redis", 6379);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }

    /**
     * Redisson 설정
     */
    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.setCodec(new StringCodec());
        config.useSingleServer()
                .setAddress("redis://redis:6379")
                .setDatabase(0)
                .setConnectionMinimumIdleSize(1)
                .setConnectionPoolSize(10);

        return org.redisson.Redisson.create(config);
    }
}
