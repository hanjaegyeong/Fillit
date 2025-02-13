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

    @Query("SELECT f.follower, " +
            "CASE WHEN EXISTS (SELECT 1 FROM Follow mf " +
            "WHERE mf.followee.personalId = f.follower.personalId " +
            "AND mf.follower.personalId = :myPersonalId) " +
            "THEN true ELSE false END " +
            "FROM Follow f " +
            "WHERE f.followee.personalId = :personalId " +
            "AND (f.follower.name LIKE %:word% OR f.follower.personalId LIKE %:word%)")
    List<Object[]> searchFollowerWithFollowStatus(@Param("personalId") String personalId,
                                                  @Param("word") String word,
                                                  @Param("myPersonalId") String myPersonalId);

    @Query("SELECT f.followee, " +
            "CASE WHEN EXISTS (SELECT 1 FROM Follow mf " +
            "WHERE mf.followee.personalId = f.followee.personalId " +
            "AND mf.follower.personalId = :myPersonalId) " +
            "THEN true ELSE false END " +
            "FROM Follow f " +
            "WHERE f.follower.personalId = :personalId " +
            "AND (f.followee.name LIKE %:word% OR f.followee.personalId LIKE %:word%)")
    List<Object[]> searchFolloweeWithFollowStatus(@Param("personalId") String personalId,
                                                  @Param("word") String word,
                                                  @Param("myPersonalId") String myPersonalId);
}