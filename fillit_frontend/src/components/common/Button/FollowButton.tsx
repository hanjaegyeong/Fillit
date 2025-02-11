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
    // followeePersonalId 검증 추가
    if (!followeePersonalId) {
      console.error('followeePersonalId가 제공되지 않았습니다.');
      return;
    }

    // 로그인 체크 및 토큰 디버깅
    const accessToken = localStorage.getItem('accessToken');
    console.log('현재 토큰:', accessToken);
    console.log('팔로우할 유저 ID:', followeePersonalId); // 디버깅 추가

    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      if (isFollowingState) {
        console.log('Unfollow 요청:', followeePersonalId);
        await postUnfollow(followeePersonalId);
      } else {
        console.log('Follow 요청:', followeePersonalId);
        await postFollow(followeePersonalId);
      }
      setIsFollowingState(!isFollowingState);
      onFollowChange?.(!isFollowingState);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('에러 응답:', error.response);
        if (error.response?.status === 403) {
          console.error('팔로우 권한이 없습니다:', error);
          if (error.response?.data) {
            console.log('에러 상세:', error.response.data);
          }
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else {
          console.error('팔로우 작업 실패:', error);
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
