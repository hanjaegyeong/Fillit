import { LikeActiveIcon, LikeInactiveIcon } from '@/assets/assets';
import useLike from '@/hooks/useLike';

interface LikeBadgeProps {
  type: 'article' | 'comment' | 'reply';
  id: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
  size?: 'small' | 'large';
}

const LikeBadge = ({
  type,
  id,
  initialIsLiked,
  initialLikeCount,
  size = 'large',
}: LikeBadgeProps) => {
  const { liked, count, handleToggleLike } = useLike({
    type,
    id,
    initialIsLiked,
    initialLikeCount,
  });

  return (
    <div className="flex items-center gap-1 w-8">
      <img
        src={liked ? LikeActiveIcon : LikeInactiveIcon}
        alt="like icon"
        className={size === 'large' ? 'h-5.5 w-5.5' : 'h-5 w-5'}
        onClick={handleToggleLike}
      />
      <div className="text-sm">{count}</div>
    </div>
  );
};

export default LikeBadge;
