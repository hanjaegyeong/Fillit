import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import TimeStamp from '@/components/common/Timestamp';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import CommentBadge from '@/components/common/Badge/CommentBadge';
import { Comment } from '@/types/comment';
import { useNavigate } from 'react-router-dom';
import CommentImage from '@/assets/images/comment-bg.png';

interface CommentContentProps {
  comment: Comment;
  position: 'left' | 'right';
  isReply?: boolean;
}

const CommentContent = ({
  comment,
  position,
  isReply = false,
}: CommentContentProps) => {
  const navigate = useNavigate();

  const handleGoCommentDetail = () => {
    navigate(`/comment`);
  };

  return (
    <div
      className={`bg-contain bg-no-repeat bg-center w-[250px] flex items-center -mt-7 ${
        position === 'left' ? 'mr-24' : 'ml-24'
      }`}
      style={{
        backgroundImage: `url(${CommentImage})`,
      }}
      onClick={handleGoCommentDetail}
    >
      <div className={`flex flex-col space-y-2 py-7 pl-16 pr-12`}>
        <div
          className={`flex items-center ${
            isReply ? 'justify-between' : 'gap-2'
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
