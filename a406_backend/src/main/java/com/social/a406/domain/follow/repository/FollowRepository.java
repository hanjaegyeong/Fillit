package  com.social.a406.domain.follow.repository;

import  com.social.a406.domain.follow.entity.Follow;
import  com.social.a406.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository <Follow, Long> {

    //ERD에서는 ID로 참조하더라도 JPA에서는 USER객체로 받아 매핑하느게 더좋다 .. ?
    List<Follow> findByFollower(User follower);
    List<Follow> findByFollowee(User followee);

    Optional<Follow> findByFollowerAndFollowee(User follower, User followee);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followee = :user")
    Long countFollowers(@Param("user") User user);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.follower = :user")
    Long countFollowees(@Param("user") User user);

    boolean existsByFolloweeIdAndFollowerId(String followeeId, String followerId);
}