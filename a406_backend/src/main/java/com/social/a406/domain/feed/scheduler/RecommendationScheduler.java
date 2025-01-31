package com.social.a406.domain.feed.scheduler;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.feed.entity.Recommended;
import com.social.a406.domain.feed.repository.BoardRepository;
import com.social.a406.domain.feed.repository.RecommendedRepository;
import com.social.a406.domain.interest.entity.UserInterest;
import com.social.a406.domain.interest.repository.UserInterestRepository;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class RecommendationScheduler {

    private RecommendedRepository recommendedRepository;
    private BoardRepository boardRepository;
    private UserRepository userRepository;
    private UserInterestRepository userInterestRepository;

    /**
     * 매 6시간마다 실행되는 스케줄러
     */
    @Scheduled(cron = "0 0 */6 * * *") // 매 6시간마다 실행
    public void updateRecommendedPosts() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            List<UserInterest> userInterests = userInterestRepository.findByUser_Id(user.getId());

            for (UserInterest userInterest : userInterests) {
                String interestContent = userInterest.getInterest().getContent().trim();

                // 기존 추천 게시물 삭제 (6시간 이전)
                recommendedRepository.deleteByInterestAndAddedAtBefore(
                        interestContent,
                        LocalDateTime.now().minusHours(6)
                );

                // 새로운 추천 게시물 추가
                PageRequest recommendedPageable = PageRequest.of(0, 10, org.springframework.data.domain.Sort.by("createdAt").descending());
                List<Board> recommendedBoards = boardRepository.findRecommendedBoards(
                        interestContent,
                        10, // 최소 좋아요 수
                        LocalDateTime.now().minusDays(3),
                        recommendedPageable
                );

                for (Board board : recommendedBoards) {
                    Recommended recommended = new Recommended();
                    recommended.setInterest(interestContent);
                    recommended.setBoard(board);
                    recommended.setAddedAt(LocalDateTime.now());
                    recommendedRepository.save(recommended);
                }
            }
        }
    }
}