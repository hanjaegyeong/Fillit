package com.social.a406.domain.feed.service;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.feed.dto.FeedResponseDto;
import com.social.a406.domain.feed.dto.PostDto;
import com.social.a406.domain.feed.entity.Feed;
import com.social.a406.domain.feed.repository.FeedBoardRepository;
import com.social.a406.domain.feed.repository.FeedRepository;
import com.social.a406.domain.interest.entity.UserInterest;
import com.social.a406.domain.interest.repository.UserInterestRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class FeedService {

    private final UserRepository userRepository;
    private final UserInterestRepository userInterestRepository;
    private final FeedBoardRepository feedBoardRepository;
    private final FeedRepository feedRepository;


    /**
     * 피드 조회 – 친구 게시물(푸시된 데이터)과 추천 게시물(풀 방식)을 4:1 비율로 결합하여 반환
     */
    public FeedResponseDto getFeed(String personalId, int limit, LocalDateTime cursor) {
        // 0. 커서 null 일 경우 초기화
        if(cursor==null) cursor = LocalDateTime.now();

        // 1. 사용자 조회
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with personalId: " + personalId));
        String userId = user.getId();

        // 2. 사용자 관심사 조회 (매핑 테이블)
        List<UserInterest> userInterests = userInterestRepository.findByUser_Id(userId);
        List<String> interests = userInterests.stream()
                .map(ui -> ui.getInterest().getContent().trim())
                .collect(Collectors.toList());

        // 3. 친구 게시물 조회 – Feed 테이블에서 푸시된 데이터 (예: 80% 비율)
        int followLimit = (int) Math.ceil(limit * 0.8);
        PageRequest followPageable = PageRequest.of(0, followLimit, Sort.by("addedAt").descending());
        List<Feed> feedEntries = feedRepository.findByUserIdAndAddedAtBefore(userId, cursor, followPageable);
        List<Board> friendBoards = feedEntries.stream()
                .map(Feed::getBoard)
                .collect(Collectors.toList());

        // 4. 추천 게시물 조회 – 풀 방식 (조건: 관심사 동일, 최근 3일, 좋아요 수 ≥ 10)
        int recommendedLimit = limit - friendBoards.size();
        List<Board> recommendedBoards = new ArrayList<>();
        for (String interest : interests) {
            PageRequest recommendedPageable = PageRequest.of(0, recommendedLimit * 2, Sort.by("createdAt").descending());
            List<Board> fetchedRecommended = feedBoardRepository.findRecommendedBoards(interest,
                    10,
                    LocalDateTime.now().minusDays(3),
                    recommendedPageable);
            recommendedBoards.addAll(fetchedRecommended);
        }
        // 중복 제거 및 랜덤 섞기
        Set<Long> recSet = new HashSet<>();
        recommendedBoards = recommendedBoards.stream()
                .filter(b -> recSet.add(b.getId()))
                .collect(Collectors.toList());
        Collections.shuffle(recommendedBoards);
        if (recommendedBoards.size() > recommendedLimit) {
            recommendedBoards = recommendedBoards.subList(0, recommendedLimit);
        }

        // 5. 피드 결합 – 친구 게시물 4개에 추천 게시물 1개 (4:1 비율)
        List<PostDto> feedPosts = new ArrayList<>();
        int friendIndex = 0, recIndex = 0;
        while (feedPosts.size() < limit && (friendIndex < friendBoards.size() || recIndex < recommendedBoards.size())) {
            for (int i = 0; i < 4 && friendIndex < friendBoards.size(); i++) {
                feedPosts.add(convertToDto(friendBoards.get(friendIndex++), false));
                if (feedPosts.size() == limit) break;
            }
            if (recIndex < recommendedBoards.size() && feedPosts.size() < limit) {
                feedPosts.add(convertToDto(recommendedBoards.get(recIndex++), true));
            }
        }


        LocalDateTime nextCursor = feedPosts.isEmpty() ? null : friendBoards.get(friendBoards.size()-1).getCreatedAt();
        return new FeedResponseDto(feedPosts, nextCursor);
    }

    private PostDto convertToDto(Board board, Boolean isRecommended) {
        PostDto dto = PostDto.builder()
                .boardId(board.getId())
                .userId(board.getUser().getId())
                .content(board.getContent())
                .likeCount(board.getLikeCount())
                .createdAt(board.getCreatedAt())
                .isRecommended(isRecommended)
                .build();

        return dto;
    }
}
