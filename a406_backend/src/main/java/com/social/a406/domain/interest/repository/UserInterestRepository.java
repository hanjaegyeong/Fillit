package com.social.a406.domain.interest.repository;

import com.social.a406.domain.interest.entity.UserInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserInterestRepository extends JpaRepository<UserInterest, Long> {
    List<UserInterest> findByUser_Id(String userId);

    void deleteByUser_Id(String userId);

    // 특정 personalId 사용자의 모든 관심사 ID 조회
    @Query("SELECT ui.interest.id " +
            "FROM UserInterest ui " +
            "WHERE ui.user.personalId = :personalId")
    List<Long> findIdsByPersonalId(@Param("personalId") String personalId);

    // 여러 관심사 ID와 일치하는 AI 유저 목록 조회
    @Query("SELECT DISTINCT ui.user.personalId " +
            "FROM UserInterest ui " +
            "WHERE ui.interest.id IN :interestIds " +
            "AND ui.user.mainPrompt IS NOT NULL " +
            "AND ui.user.isDeleted = false")
    List<String> findUserPersonalIdsByInterestIdsAndNonNullPrompt(@Param("interestIds") List<Long> interestIds);

    @Query("SELECT DISTINCT ui.user.personalId " +
            "FROM UserInterest ui " +
            "WHERE ui.interest.id IN :interestIds " +
            "AND ui.user.mainPrompt IS NULL " +
            "AND ui.user.isDeleted = false " +
            "AND ui.user.id NOT IN ( " +
            "    SELECT f.followee.id FROM Follow f WHERE f.follower.id = :personalId " +
            ")")
    List<String> findUserPersonalIdsByInterestIdsExcludingFollowed(
            @Param("interestIds") List<Long> interestIds,
            @Param("personalId") String personalId);

    void deleteByUserId(String id);
}