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

    @PostMapping("/{userId}")
    public void addUserInterests(@PathVariable Long userId, @RequestBody List<String> interestContents) {
        interestService.addUserInterests(userId, interestContents);
    }

    @GetMapping
    public List<InterestResponse> getAllInterests() {
        return interestService.getAllInterests();
    }

    @GetMapping("/{userId}")
    public List<InterestResponse> getUserInterests(@AuthenticationPrincipal UserDetails userDetails) {
        return interestService.getUserInterests(userDetails.getUsername());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserInterests(@PathVariable Long userId) {
        interestService.deleteAllUserInterests(userId);
        return ResponseEntity.noContent().build();
    }
}
