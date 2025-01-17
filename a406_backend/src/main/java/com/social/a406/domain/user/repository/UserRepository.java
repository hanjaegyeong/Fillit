package com.social.a406.domain.user.repository;

import com.social.a406.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByLoginId(String loginId);

    Optional<User> findBySocialId(String socialId);

    Optional<User> findByNickname(String nickname);

    boolean existsByLoginId(String loginId); // 일반 로그인 ID 중복 체크

    boolean existsBySocialDomainAndSocialId(String socialDomain, String socialId); // 소셜 로그인 중복 체크

}