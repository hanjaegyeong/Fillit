package com.social.a406.domain.interest.repository;

import com.social.a406.domain.interest.entity.Interest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterestRepository extends JpaRepository<Interest, Long> {
    Optional<Interest> findByContent(String content);
    List<Interest> findAll();
}
