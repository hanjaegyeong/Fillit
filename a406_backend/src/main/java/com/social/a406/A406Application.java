package com.social.a406;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // @Scheduled 동작 위한 애노테이션
public class A406Application {

	public static void main(String[] args) {
		SpringApplication.run(A406Application.class, args);
	}

}
