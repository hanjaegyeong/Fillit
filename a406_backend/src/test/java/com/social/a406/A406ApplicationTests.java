package com.social.a406;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@ImportAutoConfiguration(exclude = {
		org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration.class,
		org.redisson.spring.starter.RedissonAutoConfiguration.class
})
class A406ApplicationTests {

	@Test
	void contextLoads() {
	}

}
