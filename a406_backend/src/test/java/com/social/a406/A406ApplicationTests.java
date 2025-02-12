package com.social.a406;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
		properties = "spring.autoconfigure.exclude=org.redisson.spring.starter.RedissonAutoConfiguration"
)
class A406ApplicationTests {

	@Test
	void contextLoads() {
	}

}
