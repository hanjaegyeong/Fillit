package com.social.a406.domain.interest.repository;

import com.social.a406.domain.interest.entity.UserInterest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInterestRepository extends JpaRepository<UserInterest, Long> {
}