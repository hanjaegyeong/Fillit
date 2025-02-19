package com.social.a406.domain.feed.cache;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.entity.BoardImage;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.feed.dto.PostDto;
import com.social.a406.domain.feed.repository.FeedBoardRepository;
import com.social.a406.domain.interest.entity.Interest;
import com.social.a406.domain.interest.repository.InterestRepository;
import com.social.a406.domain.like.repository.BoardLikeRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RecommendedCacheUpdater {

    @Resource(name = "jsonRedisTemplate")
    private final RedisTemplate<String, Object> redisTemplate;
    private final FeedBoardRepository feedBoardRepository;
    private final InterestRepository interestRepository;
    private final BoardService boardService;
    private final CommentService commentService;
    private final BoardLikeRepository boardLikeRepository;

    // 관심사 ID 목록
    private List<Long> interestIds;

    @PostConstruct
    public void init() {
        this.interestIds = interestRepository.findAll().stream()
                .map(Interest::getId)
                .collect(Collectors.toList());
    }
    /**
     * 매 10분마다 각 관심사별 추천 게시물을 Redis에 업데이트하는 예시 배치 작업
     */
    @Scheduled(fixedRate = 60 * 60 * 1000) // 1시간마다 실행
    public void updateRecommendedCache() {
        System.out.println("Redis Casching is proceeding ...");

        for (Long interestId : interestIds) {
            // 추천 조건에 맞는 게시물들을 조회 (예시: 좋아요 1개 이상, 최근 7일 이내 등)
            List<PostDto> recommendedBoards = feedBoardRepository.findRecommendedBoards(
                    interestId,
                    1, // 일단 1개로
                    LocalDateTime.now().minusDays(60),
                    PageRequest.of(0, 400, Sort.by("createdAt").descending())
            ).stream().map(this::convertToDto).toList();


            // Redis에 저장할 key
            String key = "feed:recommended:" + interestId;

            ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();

            // 추천 게시물을 Redis에 추가 (추가 시 기존 데이터는 그대로 둠)
            for (PostDto board : recommendedBoards) {
                double score = board.getCreatedAt().toEpochSecond(ZoneOffset.UTC);
                zSetOps.add(key, board, score);
            }

            // 캐시 내 추천 게시물 수를 200개로 제한 (최신 200개 유지)
            // Sorted Set의 크기가 200을 초과하면, rank 0 ~ (총 개수 - 200) 범위의 데이터를 제거
            Long currentSize = zSetOps.size(key);
            int maxSize = 400;  // 원하는 최대 개수
            if(currentSize != null && currentSize > maxSize) {
                // 0부터 (currentSize - maxSize - 1)까지 제거
                redisTemplate.opsForZSet().removeRange(key, 0, currentSize - maxSize - 1);
            }

        }
    }

    private PostDto convertToDto(Board board) {
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
                .isRecommended( true)
                .isLiked(false)
                .build();

        return dto;
    }
}


