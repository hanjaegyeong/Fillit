import { useNavigate } from 'react-router-dom';

interface ProfileFollowProps {
  followersCount: number;
  followingCount: number;
  personalId: string;
}

const ProfileFollow = ({
  followersCount,
  followingCount,
  personalId,
}: ProfileFollowProps) => {
  const navigate = useNavigate();

  const handleFollowerClick = () => {
    navigate(`/profile/${personalId}/follower`);
  };

  const handleFollowingClick = () => {
    navigate(`/profile/${personalId}/following`);
  };

  return (
    <div className="flex flex-col">
      <button onClick={handleFollowerClick}>
        <div className="w-[8.438rem] bg-[#ffffff1f] px-4 py-1.5 rounded-[999px] shadow-[0px_2px_4px_#00000040] mt-2">
          <span className="-ml-1 text-sm font-light">follower</span>
          <span className="ml-4">{followersCount}</span>
        </div>
      </button>
      <button onClick={handleFollowingClick}>
        <div className="w-[8.438rem] bg-[#ffffff1f] px-4 py-1.5 rounded-[999px] shadow-[0px_2px_4px_#00000040] mt-2">
          <span className="-ml-1.5 text-sm font-light">following</span>
          <span className="ml-2.5">{followingCount}</span>
        </div>
      </button>
    </div>
  );
};

export default ProfileFollow;
