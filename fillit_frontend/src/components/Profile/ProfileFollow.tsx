import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileFollowProps {
  followersCount: number;
  followingCount: number;
  personalId: string;
  onFollowChange: (isFollowing: boolean) => void;
}

const ProfileFollow = ({
  followersCount: initialFollowersCount = 0,
  followingCount: initialFollowingCount = 0,
  personalId,
}: ProfileFollowProps) => {
  const [followers, setFollowers] = useState(initialFollowersCount);
  const [following, setFollowing] = useState(initialFollowingCount);

  const navigate = useNavigate();

  useEffect(() => {
    setFollowers(initialFollowersCount);
    setFollowing(initialFollowingCount);
  }, [initialFollowersCount, initialFollowingCount]);

  const handleFollowerClick = () => {
    navigate(`/profile/${personalId}/follower`);
  };

  const handleFollowingClick = () => {
    navigate(`/profile/${personalId}/following`);
  };

  return (
    <div>
      <button onClick={handleFollowerClick}>
        <div className="w-[8.438rem] bg-[#ffffff1f] px-4 py-1.5 rounded-[999px] shadow-[0px_2px_4px_#00000040] mt-2">
          <span className="-ml-1 text-sm font-light">follower</span>
          <span className="ml-4">{followers}</span>
        </div>
      </button>
      <button onClick={handleFollowingClick}>
        <div className="w-[8.438rem] bg-[#ffffff1f] px-4 py-1.5 rounded-[999px] shadow-[0px_2px_4px_#00000040] mt-2">
          <span className="-ml-1.5 text-sm font-light">following</span>
          <span className="ml-2.5">{following}</span>
        </div>
      </button>
    </div>
  );
};

export default ProfileFollow;
