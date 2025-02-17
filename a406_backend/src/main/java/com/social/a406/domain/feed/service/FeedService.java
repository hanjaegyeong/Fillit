package com.social.a406.domain.feed.service;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.entity.BoardImage;
import com.social.a406.domain.board.repository.BoardRepository;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.feed.dto.FeedResponseDto;
import com.social.a406.domain.feed.dto.PostDto;
import com.social.a406.domain.feed.entity.Feed;
import com.social.a406.domain.feed.repository.FeedBoardRepository;
import com.social.a406.domain.feed.repository.FeedRepository;
import com.social.a406.domain.interest.entity.UserInterest;
import com.social.a406.domain.interest.repository.UserInterestRepository;
import com.social.a406.domain.like.repository.BoardLikeRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import com.social.a406.util.exception.ForbiddenException;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class FeedService {

    private final UserRepository userRepository;
    private final UserInterestRepository userInterestRepository;
    private final FeedBoardRepository feedBoardRepository;
    private final FeedRepository feedRepository;
    private final CommentService commentService;
    private final BoardService boardService;
    private final BoardRepository boardRepository;
    private final BoardLikeRepository boardLikeRepository;
    @Resource(name = "jsonRedisTemplate")
    private final RedisTemplate<String, Object> redisTemplate;


    /**
     * 피드 조회 – 친구 게시물(푸시된 데이터)과 추천 게시물(풀 방식)을 4:1 비율로 결합하여 반환
     */
    public FeedResponseDto getFeed(String personalId, int limit, LocalDateTime cursorFollow, LocalDateTime cursorRecommend) {
        // 0. 커서 null 일 경우 초기화
        if(cursorFollow==null) cursorFollow = LocalDateTime.now();
        if(cursorRecommend==null) cursorRecommend = LocalDateTime.now();


        // 1. 사용자 조회
        User user = userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new ForbiddenException("User not found with personalId: " + personalId));
        String userId = user.getId();

        // 2. 사용자 관심사 조회 (매핑 테이블)
        List<UserInterest> userInterests = userInterestRepository.findByUser_Id(userId);
        List<Long> interests = userInterests.stream()
                .map(ui -> ui.getInterest().getId())
                .collect(Collectors.toList());

        // 3. 친구 게시물 조회 – Feed 테이블에서 푸시된 데이터 (예: 80% 비율)
        int followLimit = (int) Math.ceil(limit * 0.8);
        PageRequest followPageable = PageRequest.of(0, followLimit, Sort.by("createdAt").descending());
        List<Feed> feedEntries = feedRepository.findByUserIdAndCreatedAtAfter(userId, cursorFollow, followPageable);
        List<Board> friendBoards = feedEntries.stream()
                .map(Feed::getBoard)
                .collect(Collectors.toList());

        // 4. 추천 게시물 조회 – Redis 캐시에서 각 관심사별로 조회
        int recommendedLimit = limit - friendBoards.size();
        List<PostDto> recommendedBoards = new ArrayList<>();

        // Redis sorted set을 활용하여, 각 관심사별 캐시에서 추천 게시물 가져오기
        for (Long interest : interests) {
            List<PostDto> boardsForInterest = getCachedRecommendedBoards(interest, recommendedLimit, cursorRecommend);
            recommendedBoards.addAll(boardsForInterest);
        }

        // 중복 제거를 위한 Set
        Set<Long> addedBoardIds = new HashSet<>();

        // 중복 제거 후 저장
        friendBoards = friendBoards.stream()
                .filter(board -> addedBoardIds.add(board.getId())) // 중복 ID 필터링
                .collect(Collectors.toList());

        recommendedBoards = recommendedBoards.stream()
                .filter(board -> addedBoardIds.add(board.getBoardId())) // 중복 ID 필터링
                .collect(Collectors.toList());

        // 랜덤섞기
        Collections.shuffle(recommendedBoards);
        if (recommendedBoards.size() > recommendedLimit) {
            recommendedBoards = recommendedBoards.subList(0, recommendedLimit);
        }

        // 5. 피드 결합 – 친구 게시물 4개에 추천 게시물 1개 (4:1 비율)
        List<PostDto> feedPosts = new ArrayList<>();
        int friendIndex = 0, recIndex = 0;
        while (feedPosts.size() < limit && (friendIndex < friendBoards.size() || recIndex < recommendedBoards.size())) {
            for (int i = 0; i < 4 && friendIndex < friendBoards.size(); i++) {
                feedPosts.add(convertToDto(friendBoards.get(friendIndex++), false, userId));
                if (feedPosts.size() == limit) break;
            }
            if (recIndex < recommendedBoards.size() && feedPosts.size() < limit) {
                feedPosts.add(setIsLike(recommendedBoards.get(recIndex++), userId));
            }
        }

        // 커서 설정해주기
        LocalDateTime nextCursor;
        LocalDateTime nextCursorRecommend;
        if (!friendBoards.isEmpty()) {
            nextCursor = friendBoards.get(friendBoards.size() - 1).getCreatedAt();
        } else {
            nextCursor = null;
        }

        if (!recommendedBoards.isEmpty()) {
            nextCursorRecommend = recommendedBoards.get(recommendedBoards.size() - 1).getCreatedAt();
        } else {
            nextCursorRecommend = null;
        }

        return new FeedResponseDto(feedPosts, nextCursor, nextCursorRecommend);
    }

    private PostDto setIsLike(PostDto postDto, String userId) {
        postDto.setIsLiked(boardLikeRepository.existsByUser_IdAndBoard_Id(userId, postDto.getBoardId()));
        return postDto;
    }

    // Redis 캐시에서 특정 관심사에 해당하는 추천 게시물을 조회
    private List<PostDto> getCachedRecommendedBoards(Long interestId, int limit, LocalDateTime cursor) {
        String key = "feed:recommended:" + interestId;
        double maxScore = cursor.toEpochSecond(ZoneOffset.UTC);
        // Sorted Set에서 score가 maxScore 이하인 게시물을 최신순(reverseRangeByScore)
        Set<Object> cachedSet = redisTemplate.opsForZSet()
                .reverseRangeByScore(key, 0, maxScore, 0, limit);
        List<PostDto> boards = new ArrayList<>();
        if (!cachedSet.isEmpty()) {
            cachedSet.forEach(obj -> boards.add((PostDto) obj));
//            System.out.println("Get cashed Boards size: " + cachedSet.size());
        }
        return boards;
    }


    private PostDto convertToDto(Board board, Boolean isRecommended, String userId) {
        String boardImageUrl = boardService.findFirstByBoardIdOrderByIdAsc(board.getId())
                .map(BoardImage::getImageUrl)
                .orElse(null);

        PostDto dto = PostDto.builder()
                .boardId(board.getId())
                .content(board.getContent())
                .personalId(board.getUser().getPersonalId())
                .profileImageUrl(board.getUser().getProfileImageUrl())

                .likeCount(board.getLikeCount())
                .commentCount(commentService.getCommentCountByBoard(board.getId()))
                .keyword(board.getKeyword())
                .imageUrl(boardImageUrl)
                .createdAt(board.getCreatedAt())
                .isRecommended(isRecommended)
                .isLiked(boardLikeRepository.existsByUser_IdAndBoard_Id(userId, board.getId()))
                .build();

        return dto;
    }

    @Transactional
    public void addBoardsToUserFeed(User user, User otherUser) {
        // 팔로우한 사용자의 모든 게시글 조회
        List<Board> boards = boardRepository.findByUser(otherUser);

        // 피드에 게시글 추가 (Builder 사용)
        List<Feed> feeds = boards.stream()
                .map(board -> Feed.builder()
                        .user(user)
                        .board(board)
                        .isRecommended(false) // 기본값 설정
                        .createdAt(board.getCreatedAt()) // 현재 시간 설정
                        .build())
                .collect(Collectors.toList());

        feedRepository.saveAll(feeds);
    }


    /**
     * 언팔로우 시 user의 피드에서 otherUser의 모든 게시글 삭제
     */
    @Transactional
    public void removeBoardsFromUserFeed(User user, User otherUser) {
        // otherUser의 모든 게시글 조회
        List<Board> boardList = boardRepository.findByUser(otherUser);

        // feed에서 해당 게시글들을 삭제 (더 빠른 삭제 가능)
        if (!boardList.isEmpty()) {
            feedRepository.deleteByUserAndBoardIn(user.getId(), boardList);
        }
    }



}
