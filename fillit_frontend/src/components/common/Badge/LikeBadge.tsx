import { LikeActiveIcon, LikeInactiveIcon } from '@/assets/assets';

interface LikeBadgeProps {
  isLiked?: boolean;
  likeCount: number;
  size?: 'small' | 'large';
}

const LikeBadge = ({
  isLiked = false,
  likeCount,
  size = 'large',
}: LikeBadgeProps) => {
  return (
    <div className="flex items-center gap-1">
      <img
        src={isLiked ? LikeActiveIcon : LikeInactiveIcon}
        alt="like icon"
        className={size === 'large' ? 'h-5 w-5' : 'h-3.5 w-3.5'}
      />
      <div className="text-s">{likeCount}</div>
    </div>
  );
};

export default LikeBadge;
