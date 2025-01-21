package com.social.a406.domain.scheduler.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/random")
public class RandomController {

    @GetMapping("/trigger")
    public ResponseEntity<String> trigger() {
        return ResponseEntity.ok("Triggered at: " + LocalDateTime.now());
    }
}
