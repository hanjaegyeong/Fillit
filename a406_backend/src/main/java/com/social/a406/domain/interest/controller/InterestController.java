package com.social.a406.domain.interest.controller;

import com.social.a406.domain.interest.dto.InterestResponse;
import com.social.a406.domain.interest.service.InterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interests")
@RequiredArgsConstructor
public class InterestController {

    private final InterestService interestService;

    @PostMapping
    public ResponseEntity<String> addUserInterests(@AuthenticationPrincipal UserDetails userDetails, @RequestBody List<String> interestContents) {
        interestService.addUserInterests(userDetails.getUsername(), interestContents);
        return ResponseEntity.status(201).body("Success to add user interests");
    }

    @GetMapping
    public ResponseEntity<List<InterestResponse>> getAllInterests() {
        return ResponseEntity.ok(
                interestService.getAllInterests());
    }

    @GetMapping("/user")
    public ResponseEntity<List<InterestResponse>> getUserInterests(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                interestService.getUserInterests(userDetails.getUsername()));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUserInterests(@AuthenticationPrincipal UserDetails userDetails) {
        interestService.deleteAllUserInterests(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}