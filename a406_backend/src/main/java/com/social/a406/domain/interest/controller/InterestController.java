package com.social.a406.domain.interest.controller;

import com.social.a406.domain.interest.dto.InterestResponse;
import com.social.a406.domain.interest.entity.Interest;
import com.social.a406.domain.interest.entity.UserInterest;
import com.social.a406.domain.interest.service.InterestService;
import lombok.RequiredArgsConstructor;
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
    public List<InterestResponse> getUserInterests(@PathVariable Long userId) {
        return interestService.getUserInterests(userId);
    }
}
