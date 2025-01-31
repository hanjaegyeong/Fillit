import { CommentIcon } from '@/assets/assets';

interface CommentBadgeProps {
  commentCount: number;
  size?: 'small' | 'large';
}

const CommentBadge = ({ commentCount, size = 'large' }: CommentBadgeProps) => {
  return (
    <div className="flex items-center gap-1">
      <img
        src={CommentIcon}
        alt="like icon"
        className={size === 'large' ? 'h-5 w-5' : 'h-3.5 w-3.5'}
      />
      <div className="text-s">{commentCount}</div>
    </div>
  );
};

export default CommentBadge;
