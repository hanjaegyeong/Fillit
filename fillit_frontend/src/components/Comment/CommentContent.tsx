import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import TimeStamp from '@/components/common/Timestamp';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import CommentBadge from '@/components/common/Badge/CommentBadge';
import { Comment } from '@/types/comment';
import { useNavigate } from 'react-router-dom';
import CommentImage from '@/assets/images/comment-bg.png';

interface CommentContentProps {
  comment: Comment;
  isReply?: boolean;
}

const CommentContent = ({ comment, isReply = false }: CommentContentProps) => {
  const navigate = useNavigate();

  const handleGoCommentDetail = () => {
    navigate(`/comment`);
  };

  return (
    <div
      className={`bg-contain bg-no-repeat bg-center w-[200px] flex items-center`}
      style={{
        backgroundImage: `url(${CommentImage})`,
      }}
      onClick={handleGoCommentDetail}
    >
      <div className={`flex flex-col h-full space-y-2 px-12 `}>
        <div
          className={`flex items-center ${
            isReply ? 'justify-between' : 'gap-4'
          }`}
        >
          <ProfileBadge
            profileImageUrl={comment.profileImageUrl}
            personalId={comment.personalId}
            imageSize={27}
          />
          <TimeStamp date={comment.createdAt} size="small" />
        </div>
        <div className="font-extralight text-xxs">{comment.content}</div>
        <div className="flex justify-end gap-4">
          <LikeBadge
            likeCount={comment.likeCount}
            isLiked={true}
            size="small"
          />
          <CommentBadge commentCount={comment.commentCount} size="small" />
        </div>
      </div>
    </div>
  );
};

export default CommentContent;
