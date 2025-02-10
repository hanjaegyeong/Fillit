package com.social.a406.domain.user.repository;

import com.social.a406.domain.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findById(String Id);

    Optional<User> findBySocialId(String socialId);

    Optional<User> findByPersonalId(String personalId);

    boolean existsByEmail(String email); // 이메일 중복 체크 시

    boolean existsBySocialDomainAndSocialId(String socialDomain, String socialId); // 소셜 로그인 중복 체크 시

    boolean existsByPersonalId(String personalId);

    @Query("SELECT u FROM User u WHERE u.mainPrompt IS NOT NULL ORDER BY FUNCTION('RAND')")
    List<User> findUsersWithMainPrompt(Pageable pageable);

    @Query("SELECT u FROM User u WHERE " +
            "(u.personalId LIKE %:word% OR u.name LIKE %:word%) " +
            "AND (:cursorPersonalId IS NULL OR u.personalId > :cursorPersonalId) " +
            "ORDER BY u.personalId ASC")
    List<User> searchUsers(@Param("word") String word,
                           @Param("cursorPersonalId") String cursorPersonalId,
                           Pageable pageable);

    @Query("""
    SELECT u.id FROM User u
    WHERE u.personalId IN :personalIdList
    """)
    List<String> findUserIdsByPersonalIds(@Param("personalIdList") List<String> personalIdList);

    boolean existsBySocialId(String socialId);
}