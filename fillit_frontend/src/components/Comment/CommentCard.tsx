import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import TimeStamp from '@/components/common/Timestamp';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import CommentBadge from '@/components/common/Badge/CommentBadge';
import { Comment } from '@/types/comment';
import { useNavigate } from 'react-router-dom';
import CommentImage from '@/assets/images/comment-bg.png';
import SubmitInput from '@/components/common/Input/SubmitInput';
import { COMMENT_REPLY_MAX_LENGTH } from '@/constants/system';

interface CommentCardProps {
  comment: Comment;
  position?: 'left' | 'right';
  isDetail?: boolean;
  onSubmit?: (content: string) => void;
}

const CommentCard = ({
  comment,
  position = 'left',
  isDetail = false,
  onSubmit = () => {},
}: CommentCardProps) => {
  const navigate = useNavigate();

  const handleGoCommentDetail = () => {
    if (isDetail) return;
    navigate(`comment/${comment.commentId}`);
  };

  return (
    <div
      className={`bg-contain bg-no-repeat bg-center ${
        isDetail
          ? 'w-[20.8rem] min-h-[14.5rem] ml-10 '
          : 'w-[18.6rem] min-h-[11.5rem]'
      } flex items-center -mt-10 ${position === 'left' ? 'mr-16' : 'ml-20'}`}
      style={{
        backgroundImage: `url(${CommentImage})`,
      }}
      onClick={handleGoCommentDetail}
    >
      <div
        className={`flex flex-col space-y-2 ${
          isDetail ? 'py-8 pl-16 pr-8' : 'py-8 pl-16 pr-14'
        } w-[19.5rem]`}
      >
        <div className="flex items-center gap-3">
          <ProfileBadge
            profileImageUrl={comment.profileImageUrl}
            personalId={comment.personalId}
            imageSize={isDetail ? 44 : 30}
          />
          <TimeStamp date={comment.createdAt} />
        </div>
        <div className="font-extralight text-sm px-2 break-words">
          {comment.content}
        </div>
        <div className="flex justify-end gap-4">
          <LikeBadge
            likeCount={comment.likeCount}
            isLiked={true}
            size={!isDetail ? 'small' : 'large'}
          />
          <CommentBadge
            commentCount={comment.commentReplyCount}
            size={!isDetail ? 'small' : 'large'}
          />
        </div>
        {isDetail && (
          <div className="pt-1">
            <SubmitInput
              placeholder="Write a comment..."
              onSubmit={onSubmit}
              maxLength={COMMENT_REPLY_MAX_LENGTH}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
