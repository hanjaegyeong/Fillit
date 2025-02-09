package com.social.a406.domain.follow.controller;

import com.social.a406.domain.follow.dto.FollowRequest;
import com.social.a406.domain.follow.dto.FollowResponse;
import  com.social.a406.domain.follow.service.FollowService;
import  com.social.a406.domain.follow.entity.Follow;
import  com.social.a406.domain.user.entity.User;
import com.social.a406.util.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    // 팔로우 기능
    @PostMapping("/follow")
    public ResponseEntity<String> followUser
        (@AuthenticationPrincipal UserDetails userDetails, @RequestBody FollowRequest followRequest) {

        // 팔로우할 사용자 정보 받아오기
        User follower = followService.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("follower not found"));
        User followee = followService.findByPersonalId(followRequest.getFolloweePersonalId())
                .orElseThrow(() -> new IllegalArgumentException("followee not found"));

        // 자신을 팔로우하는 경우
        if(follower.getId() == followee.getId()) return ResponseEntity.badRequest().body("You cannot follow yourself");

        // 이미 있는 팔로우 인지 검증
        Optional<Follow> existingFollow = followService.findByFollowerAndFollowee(follower, followee);
        if(existingFollow.isPresent()) return ResponseEntity.badRequest().body("Follow is already exist");

        // 팔로우 기능 실행
        boolean isFollowed = followService.followUser(follower, followee);

        if (isFollowed) {
            return ResponseEntity.status(201).body("Followed successfully");
        } else {
            return ResponseEntity.badRequest().body("Follow failed");
        }
    }

    // 언팔로우 기능
    @PostMapping("/unfollow")
    public ResponseEntity<String> unfollowUser
        (@AuthenticationPrincipal UserDetails userDetails, @RequestBody FollowRequest followRequest) {
        // 언팔로우할 사용자 정보 받아오기
        User follower = followService.findByPersonalId(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User followee = followService.findByPersonalId(followRequest.getFolloweePersonalId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 언팔로우 기능 실행
        boolean isUnfollowed = followService.unfollowUser(follower, followee);

        if (isUnfollowed) {
            return ResponseEntity.ok("Unfollowed successfully");
        } else {
            return ResponseEntity.badRequest().body("Follow does not exist");
        }
    }

    // 팔로워 가져오기
    @GetMapping("/getfollower")
    public ResponseEntity<?> getFollowerlistById(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String personalId) {

        User user = followService.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<FollowResponse> followerList = followService.getFollowerList(userDetails.getUsername(), user);

        // 팔로워 없을때 how?
        if(followerList == null && followerList.size() == 0) {
            throw new BadRequestException("Follower does not exist");
        }
        return ResponseEntity.ok(followerList);
    }

    // 팔로잉 가져오기
    @GetMapping("/getfollowee")
    public ResponseEntity<List<FollowResponse>> getFolloweelistById(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String personalId) {
        User user = followService.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<FollowResponse> followeeList = followService.getFolloweeList(userDetails.getUsername(), user);

        if(followeeList == null && followeeList.size() == 0) {
            throw new BadRequestException("Followee does not exist");
        }
        return ResponseEntity.ok(followeeList);
    }

}
