import ProfileImage from '@/components/common/ProfileImage';
import FollowButton from '../common/Button/FollowButton';
import { User } from '@/types/user';
import { useUserStore } from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';

interface UserItemProps {
  userData: User;
  type: 'followers' | 'following';
}

const UserItem = ({ userData, type }: UserItemProps) => {
  const { user: currentUser } = useUserStore();
  const isCurrentUser = currentUser.personalId === userData.personalId;
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${userData.personalId}`);
  };

  return (
    <div className="flex items-center px-6 mb-[1.4rem] w-full">
      <div
        className="shrink-0 mr-2 cursor-pointer"
        onClick={handleProfileClick}
      >
        <ProfileImage src={userData.profileImageUrl} />
      </div>
      <div className="flex-1 flex items-center min-w-0">
        <div className="truncate mr-1 text-xl">{userData.name}</div>
        <div className="shrink-0 mr-2 mt-1 text-sm font-extralight italic">
          @{userData.personalId}
        </div>
      </div>
      <div className="shrink-0">
        {!isCurrentUser && (
          <FollowButton
            isFollowing={type === 'following'}
            followeePersonalId={userData.personalId}
            onFollowChange={(isFollowing) =>
              console.log('팔로우 상태 변경:', isFollowing)
            }
          />
        )}
      </div>
    </div>
  );
};

export default UserItem;
