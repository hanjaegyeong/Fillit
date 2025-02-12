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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final CommentService commentService;
    private final BoardService boardService;
    private final BoardRepository boardRepository;
    private final BoardLikeRepository boardLikeRepository;

    /**
     * 피드 조회 – 친구 게시물(푸시된 데이터)과 추천 게시물(풀 방식)을 4:1 비율로 결합하여 반환
     */
    public FeedResponseDto getFeed(String personalId, int limit, LocalDateTime cursor) {
        // 0. 커서 null 일 경우 초기화
        if(cursor==null) cursor = LocalDateTime.now();

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
        List<Feed> feedEntries = feedRepository.findByUserIdAndCreatedAtAfter(userId, cursor, followPageable);
        List<Board> friendBoards = feedEntries.stream()
                .map(Feed::getBoard)
                .collect(Collectors.toList());

        // 4. 추천 게시물 조회 – 풀 방식 (조건: 관심사 동일, 최근 3일, 좋아요 수 ≥ 10)
        int recommendedLimit = limit - friendBoards.size();
        List<Board> recommendedBoards = new ArrayList<>();
        for (Long interest : interests) {
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
                feedPosts.add(convertToDto(friendBoards.get(friendIndex++), false, userId));
                if (feedPosts.size() == limit) break;
            }
            if (recIndex < recommendedBoards.size() && feedPosts.size() < limit) {
                feedPosts.add(convertToDto(recommendedBoards.get(recIndex++), true, userId));
            }
        }


        LocalDateTime nextCursor = feedPosts.isEmpty() ? null : friendBoards.get(friendBoards.size()-1).getCreatedAt();
        return new FeedResponseDto(feedPosts, nextCursor);
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
                        .createdAt(LocalDateTime.now()) // 현재 시간 설정
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
