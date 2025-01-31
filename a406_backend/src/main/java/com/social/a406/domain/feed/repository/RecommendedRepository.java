package com.social.a406.domain.feed.repository;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.feed.entity.Recommended;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RecommendedRepository extends JpaRepository<Recommended, Long> {

    @Query("SELECT r.board FROM Recommended r WHERE r.interest = :interest")
    List<Board> findBoardsByInterest(@Param("interest") String interest);

    void deleteByInterestAndAddedAtBefore(String interest, LocalDateTime cutoffTime);
}