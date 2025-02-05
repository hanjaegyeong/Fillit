import ProfileImage from '@/components/common/ProfileImage';
import { user } from '@/mocks/fixtures/user';
import FollowButton from '../common/Button/FollowButton';

const FollowerItem = () => {
  return (
    <div className="flex items-center px-6 w-full">
      <div className="shrink-0 mr-2">
        <ProfileImage src={user.profileImageUrl} />
      </div>
      <div className="flex-1 flex items-center min-w-0">
        <div className="truncate mr-1 text-2xl">{user.name}</div>
        <div className="shrink-0 mr-2 mt-0.5 font-extralight italic">
          @{user.personalId}
        </div>
      </div>
      <div className="shrink-0">
        <FollowButton isFollowing={false} />
      </div>
    </div>
  );
};

export default FollowerItem;
