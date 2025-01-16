package com.social.a406.domain.interest.repository;

import com.social.a406.domain.interest.entity.UserInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserInterestRepository extends JpaRepository<UserInterest, Long> {
    List<UserInterest> findByUser_UserId(Long userId);
}