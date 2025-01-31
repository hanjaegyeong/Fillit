package com.social.a406.domain.feed.service;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.feed.dto.FeedResponseDto;
import com.social.a406.domain.feed.dto.PostDto;
import com.social.a406.domain.feed.repository.BoardRepository;
import com.social.a406.domain.feed.repository.FeedRepository;
import com.social.a406.domain.feed.repository.RecommendedRepository;
import com.social.a406.domain.interest.entity.UserInterest;
import com.social.a406.domain.interest.repository.UserInterestRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final FeedRepository feedRepository;
    private final RecommendedRepository recommendedRepository;
    private final UserInterestRepository userInterestRepository;

    /**
     * 피드 조회 메서드
     * @param limit 조회할 게시물 수
     * @param cursor 커서 (마지막으로 본 게시물의 createdAt)
     * @return 피드 응답 DTO
     */
    public FeedResponseDto getFeed(UserDetails userDetail, int limit, LocalDateTime cursor) {
        // 1. 개인 ID로 사용자 조회
        User user = userRepository.findByPersonalId(userDetail.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with personalId: " + userDetail.getUsername()));

        String userId = user.getId();

        // 2. 사용자의 관심사 조회 (UserInterest 매핑 테이블을 통해)
        List<UserInterest> userInterests = userInterestRepository.findByUser_Id(userId);
        List<String> interests = userInterests.stream()
                .map(ui -> ui.getInterest().getContent().trim())
                .collect(Collectors.toList()); // getContent 말고 interestId 가지고 있도록 저장하기

        // 3. 팔로우 게시물 조회 (limit * 3/4)
        int followLimit = (int) Math.ceil(limit * 0.75);
        PageRequest followPageable = PageRequest.of(0, followLimit, Sort.by("createdAt").descending());
        List<Board> followedBoards = boardRepository.findFollowedBoards(getFollowedUserIds(userId),
                cursor,
                followPageable);

        // 4. 추천 게시물 조회 (limit * 1/4)
        int recommendedLimit = limit - followedBoards.size();
        List<Board> recommendedBoards = new ArrayList<>();

        for (String interest : interests) {
            PageRequest recommendedPageable = PageRequest.of(0, recommendedLimit * 2, Sort.by("createdAt").descending());
            List<Board> fetchedRecommended = boardRepository.findRecommendedBoards(interest,
                    10, // 최소 좋아요 수
                    LocalDateTime.now().minusDays(3),
                    recommendedPageable);
            recommendedBoards.addAll(fetchedRecommended);
        }

        // 추천 게시물 중복 제거
        Set<Long> recommendedBoardIds = new HashSet<>();
        recommendedBoards = recommendedBoards.stream()
                .filter(b -> recommendedBoardIds.add(b.getBoardId()))
                .collect(Collectors.toList());
        // 추천 게시물 랜덤하게 섞기
        Collections.shuffle(recommendedBoards);
        if (recommendedBoards.size() > recommendedLimit) {
            recommendedBoards = recommendedBoards.subList(0, recommendedLimit);
        }

        // 5. 피드 게시물 섞기 (3:1 비율)
        List<PostDto> feedPosts = new ArrayList<>();
        int followIndex = 0;
        int recommendedIndex = 0;

        while (feedPosts.size() < limit && (followIndex < followedBoards.size() || recommendedIndex < recommendedBoards.size())) {
            // 팔로우 게시물 3개 추가
            for (int i = 0; i < 3 && followIndex < followedBoards.size(); i++) {
                Board board = followedBoards.get(followIndex++);
                feedPosts.add(convertToDto(board, false));
                if (feedPosts.size() == limit) break;
            }

            // 추천 게시물 1개 추가
            if (recommendedIndex < recommendedBoards.size() && feedPosts.size() < limit) {
                Board board = recommendedBoards.get(recommendedIndex++);
                feedPosts.add(convertToDto(board, true));
            }
        }

//        // 6. 다음 커서 설정 (마지막 게시물의 createdAt)
//        LocalDateTime nextCursor = feedPosts.isEmpty() ? null : feedPosts.get(feedPosts.size() - 1).getCreatedAt();

        // 7. 응답 DTO 구성
        return new FeedResponseDto(feedPosts, nextCursor);
    }

    /**
     * 사용자가 팔로우하는 사용자 ID 목록을 조회하는 메서드
     * @param userId 사용자 ID
     * @return 팔로우하는 사용자 ID 목록
     */
    private List<Long> getFollowedUserIds(String userId) {
        // 실제 구현 시, 팔로우 관계를 관리하는 테이블을 조회해야 함
        // 여기서는 예시로, 사용자가 팔로우하는 사용자 목록을 임의로 반환
        // 예시 사용자 ID: 2, 3, 4
        return Arrays.asList(2L, 3L, 4L);
    }

    /**
     * Board 엔티티를 PostDto로 변환하는 메서드
     * @param board Board 엔티티
     * @param isRecommended 추천 여부
     * @return PostDto
     */
//    private PostDto convertToDto(Board board, Boolean isRecommended) {
//        PostDto dto = new PostDto();
//        dto.setBoardId(board.getBoardId());
//        dto.setUserId(board.getUser().getUserId());
//        dto.setContent(board.getContent());
//        dto.setLikeCount(board.getLikeCount());
//        dto.setCreatedAt(board.getCreatedAt());
//        dto.setIsRecommended(isRecommended);
//        return dto;
//    }
//}