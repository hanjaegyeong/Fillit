import { postFollow, postUnfollow } from '@/api/follow';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FollowButtonProps {
  isFollowing: boolean;
  followeePersonalId: string;
  onFollowChange?: (isFollowing: boolean) => void;
  width?: string;
  height?: string;
  fontSize?: string;
}

const FollowButton = ({
  isFollowing,
  followeePersonalId,
  onFollowChange,
  width = '78px',
  height = '26px',
  fontSize = '12px',
}: FollowButtonProps) => {
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFollow = async () => {
    // 로그인 체크 및 토큰 디버깅
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      if (isFollowingState) {
        await postUnfollow(followeePersonalId);
      } else {
        await postFollow(followeePersonalId);
      }
      // 팔로우 상태 변경
      setIsFollowingState(!isFollowingState);

      // 부모 컴포넌트에 상태 변경 알림
      onFollowChange?.(!isFollowingState);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
      }
    } finally {
      setIsLoading(false);
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
    </div>
  );
};

export default FollowButton;
