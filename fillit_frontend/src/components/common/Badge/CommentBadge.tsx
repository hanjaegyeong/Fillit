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
        alt="comment icon"
        className={size === 'large' ? 'h-5.5 w-5.5' : 'h-4.5 w-4.5'}
      />
      <div className="text-sm">{commentCount}</div>
    </div>
  );
};

export default CommentBadge;
