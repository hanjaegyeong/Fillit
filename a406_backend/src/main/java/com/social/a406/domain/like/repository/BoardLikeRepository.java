package com.social.a406.domain.like.repository;

import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.like.entity.BoardLike;
import com.social.a406.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardLikeRepository extends JpaRepository<BoardLike, Long> {
    boolean existsByUserAndBoard(User user, Board board);

    Optional<BoardLike> findByUserAndBoard(User user, Board board);
}
