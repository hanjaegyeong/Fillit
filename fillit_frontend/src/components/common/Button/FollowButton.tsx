import { useState } from 'react';

interface FollowButtonProps {
  isFollowing: boolean;
  width?: string;
  height?: string;
  fontSize?: string;
}

const FollowButton = ({
  isFollowing,
  width = '78px',
  height = '26px',
  fontSize = '12px',
}: FollowButtonProps) => {
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);

  const handleFollow = () => {
    setIsFollowingState(!isFollowingState);
    if (isFollowingState) {
      console.log('unfollow');
    } else {
      console.log('follow');
    }
  };

  return (
    <div>
      <button
        onClick={handleFollow}
        className={`border border-solid border-black flex items-center gap-2.5 shadow-[1px_1px_0px_#000000] overflow-hidden rounded-xl justify-center relative font-extralight italic
          transition-all duration-200 ease-in-out
          active:shadow-none active:translate-x-[1px] active:translate-y-[1px]
          ${
            isFollowingState
              ? 'bg-[#69cbf5] px-[5px]'
              : 'bg-[#d68de1] px-[11px]'
          } py-0 leading-none`}
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
