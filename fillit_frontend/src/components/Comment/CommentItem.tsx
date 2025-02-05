import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import TimeStamp from '@/components/common/Timestamp';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import CommentBadge from '@/components/common/Badge/CommentBadge';
import { Comment } from '@/types/comment';
import { useNavigate } from 'react-router-dom';
import CommentImage from '@/assets/images/comment-bg.png';

interface CommentItemProps {
  comment: Comment;
  position?: 'left' | 'right';
  isDetail?: boolean;
}

const CommentItem = ({
  comment,
  position = 'left',
  isDetail = false,
}: CommentItemProps) => {
  const navigate = useNavigate();

  const handleGoCommentDetail = () => {
    navigate(`comment/${comment.commentId}`);
  };

  return (
    <div
      className={`bg-contain bg-no-repeat bg-center ${
        isDetail ? 'w-[18.8rem]' : 'w-[16.6rem]'
      } flex items-center -mt-8 ${position === 'left' ? 'mr-16' : 'ml-20'}`}
      style={{
        backgroundImage: `url(${CommentImage})`,
      }}
      onClick={handleGoCommentDetail}
    >
      <div
        className={`flex flex-col space-y-2 
          ${isDetail ? 'py-10' : 'py-10'} pl-16 pr-14
        `}
      >
        <div
          className={`flex items-center ${
            isDetail ? 'justify-between' : 'gap-2'
          }`}
        >
          <ProfileBadge
            profileImageUrl={comment.profileImageUrl}
            personalId={comment.personalId}
            imageSize={isDetail ? 41 : 27}
          />
          <TimeStamp date={comment.createdAt} />
        </div>
        <div
          className={`font-extralight ${
            isDetail ? 'text-s w-[10rem]' : 'text-xxs w-[9rem]'
          }`}
        >
          {comment.content}
        </div>
        <div className="flex justify-end gap-4">
          <LikeBadge
            likeCount={comment.likeCount}
            isLiked={true}
            size={!isDetail ? 'small' : 'large'}
          />
          <CommentBadge
            commentCount={comment.commentCount}
            size={!isDetail ? 'small' : 'large'}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
