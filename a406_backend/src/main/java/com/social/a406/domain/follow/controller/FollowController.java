package com.social.a406.domain.follow.controller;

import com.social.a406.domain.follow.dto.FollowSearchResponse;
import com.social.a406.domain.follow.dto.FollowRequest;
import com.social.a406.domain.follow.dto.FollowResponse;
import com.social.a406.domain.follow.service.FollowService;
import com.social.a406.util.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    // 팔로우 기능
    @PostMapping("/follow")
    public ResponseEntity<String> followUser
        (@AuthenticationPrincipal UserDetails userDetails, @RequestBody FollowRequest followRequest) {
        // 팔로우 기능 실행
        followService.followUser(userDetails.getUsername(), followRequest.getFolloweePersonalId());

        return ResponseEntity.status(201).body("Followed successfully");
    }

    // 언팔로우 기능
    @PostMapping("/unfollow")
    public ResponseEntity<String> unfollowUser
        (@AuthenticationPrincipal UserDetails userDetails, @RequestBody FollowRequest followRequest) {
        // 언팔로우 기능 실행
        followService.unfollowUser(userDetails.getUsername(), followRequest.getFolloweePersonalId());

        return ResponseEntity.ok("Unfollowed successfully");
    }

    // 팔로워 가져오기
    @GetMapping("/getfollower")
    public ResponseEntity<?> getFollowerListById(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String personalId) {
        List<FollowResponse> followerList = followService.getFollowerList(userDetails.getUsername(), personalId);

        if(followerList == null) {
            throw new BadRequestException("Follower does not exist");
        }
        return ResponseEntity.ok(followerList);
    }

    // 팔로잉 가져오기
    @GetMapping("/getfollowee")
    public ResponseEntity<List<FollowResponse>> getFolloweeListById(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String personalId) {
        List<FollowResponse> followeeList = followService.getFolloweeList(userDetails.getUsername(), personalId);

        if(followeeList == null) {
            throw new BadRequestException("Followee does not exist");
        }
        return ResponseEntity.ok(followeeList);
    }

    //팔로워 검색
    @GetMapping("/search/follower")
    public ResponseEntity<List<FollowSearchResponse>> searchFollower(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String personalId,
            @RequestParam String word
    ){
        return ResponseEntity.ok(
                followService.searchFollower(userDetails.getUsername(), personalId, word));
    }

    //팔로위 검색
    @GetMapping("/search/followee")
    public ResponseEntity<List<FollowSearchResponse>> searchFollowee(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String personalId,
            @RequestParam String word
    ){
        return ResponseEntity.ok(
                followService.searchFollowee(userDetails.getUsername(), personalId, word));
    }
}
