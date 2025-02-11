import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import TimeStamp from '@/components/common/Timestamp';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import ReplyImage from '@/assets/images/reply-bg.png';
import { CommentReply } from '@/types/comment';

interface CommentReplyCardProps {
  commentReply: CommentReply;
  position?: 'left' | 'right';
}

const CommentReplyCard = ({
  commentReply,
  position = 'left',
}: CommentReplyCardProps) => {
  return (
    <div
      className={`bg-contain bg-no-repeat bg-center w-[20rem] flex items-center -mt-12 ${
        position === 'left' ? 'ml-10' : 'ml-28'
      }`}
      style={{
        backgroundImage: `url(${ReplyImage})`,
      }}
    >
      <div
        className={`flex flex-col space-y-2 py-10 pl-14 pr-14
        `}
      >
        <div className={`flex items-center gap-4`}>
          <ProfileBadge
            profileImageUrl={commentReply.profileImageUrl}
            personalId={commentReply.personalId}
            imageSize={27}
          />
          <TimeStamp date={commentReply.createdAt} />
        </div>
        <div className="font-extralight text-xxs w-[13.4rem]">
          {commentReply.content}
        </div>
        <div className="flex justify-end">
          <LikeBadge
            likeCount={commentReply.likeCount}
            isLiked={true}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default CommentReplyCard;
