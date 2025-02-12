package com.social.a406;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.redisson.api.RedissonClient;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ImportAutoConfiguration(exclude = {
		org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration.class,
		org.redisson.spring.starter.RedissonAutoConfiguration.class
})
class A406ApplicationTests {

	@Mock
	private RedisTemplate<String, Object> redisTemplate;

	@Mock
	private RedissonClient redissonClient;

	@InjectMocks
	private A406ApplicationTests a406ApplicationTests;

	@Test
	void contextLoads() {
	}
}
