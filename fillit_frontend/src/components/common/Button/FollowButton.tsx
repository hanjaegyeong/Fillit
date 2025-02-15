import { postFollow, postUnfollow } from '@/api/follow';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UnfollowModal from '../Modal/UnfollowModal';

interface FollowButtonProps {
  isFollowing: boolean;
  followeePersonalId: string;
  onFollowChange?: (isFollowing: boolean) => void;
  width?: string;
  height?: string;
  fontSize?: string;
  userData?: {
    name: string;
    profileImageUrl: string | null;
  };
}

const FollowButton = ({
  isFollowing,
  followeePersonalId,
  onFollowChange,
  width = '78px',
  height = '26px',
  fontSize = '12px',
  userData,
}: FollowButtonProps) => {
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const navigate = useNavigate();

  const handleFollow = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/login');
      return;
    }

    // 팔로우 하는 경우
    if (!isFollowingState) {
      try {
        setIsLoading(true);
        await postFollow(followeePersonalId);
        setIsFollowingState(true);
        onFollowChange?.(true);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // 언팔로우 하는 경우 모달 표시
      setShowUnfollowModal(true);
    }
  };

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);
      await postUnfollow(followeePersonalId);
      setIsFollowingState(false);
      onFollowChange?.(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      setShowUnfollowModal(false);
    }
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`border border-solid border-black flex items-center gap-2.5 shadow-[1px_1px_0px_#000000] overflow-hidden rounded-xl justify-center relative font-extralight italic
          transition-all duration-200 ease-in-out
          active:shadow-none active:translate-x-[1px] active:translate-y-[1px]
         ${
           isFollowingState ? 'bg-[#69cbf5] px-[5px]' : 'bg-[#d68de1] px-[11px]'
         }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} 
          py-0 leading-none`}
        style={{
          width,
          height,
          fontSize,
        }}
      >
        {isFollowingState ? 'UNFOLLOW' : 'FOLLOW'}
      </button>

      {userData && (
        <UnfollowModal
          isOpen={showUnfollowModal}
          onClose={() => setShowUnfollowModal(false)}
          onConfirm={handleUnfollow}
          name={userData.name}
          profileImageUrl={userData.profileImageUrl ?? ''}
        />
      )}
    </div>
  );
};

export default FollowButton;
