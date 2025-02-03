package com.social.a406.domain.interest.repository;

import com.social.a406.domain.interest.entity.BoardInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardInterestRepository extends JpaRepository<BoardInterest, Long> {
    List<BoardInterest> findByBoard_Id(Long id);
    void deleteByBoard_Id(Long id);
}
