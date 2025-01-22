package com.social.a406.domain.user.repository;

import com.social.a406.domain.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLoginId(String loginId);

    Optional<User> findBySocialId(String socialId);

    Optional<User> findByPersonalId(String personalId);

    boolean existsByLoginId(String loginId); // 일반 로그인 ID 중복 체크

    boolean existsBySocialDomainAndSocialId(String socialDomain, String socialId); // 소셜 로그인 중복 체크

    boolean existsByPersonalId(String personalId);

    @Query("SELECT u FROM User u WHERE u.mainPrompt IS NOT NULL ORDER BY FUNCTION('RAND')")
    List<User> findUsersWithMainPrompt(Pageable pageable);
}