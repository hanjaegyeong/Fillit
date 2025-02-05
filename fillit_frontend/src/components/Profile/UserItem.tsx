import ProfileImage from '@/components/common/ProfileImage';
import FollowButton from '../common/Button/FollowButton';
import { User } from '@/types/user';

interface UserItemProps {
  userData: User;
  type: 'followers' | 'following';
}

const UserItem = ({ userData, type }: UserItemProps) => {
  return (
    <div className="flex items-center px-6 mb-[1.4rem] w-full">
      <div className="shrink-0 mr-2">
        <ProfileImage src={userData.profileImageUrl} />
      </div>
      <div className="flex-1 flex items-center min-w-0">
        <div className="truncate mr-1 text-xl">{userData.name}</div>
        <div className="shrink-0 mr-2 mt-1 text-sm font-extralight italic">
          @{userData.personalId}
        </div>
      </div>
      <div className="shrink-0">
        <FollowButton isFollowing={type === 'following'} />
      </div>
    </div>
  );
};

export default UserItem;
