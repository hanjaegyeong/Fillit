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
      className={`bg-contain bg-no-repeat bg-center w-[20rem] flex items-center -mt-12 drop-shadow-[0px_0px_1px_rgba(0,0,0,0.2)] ${
        position === 'left' ? 'ml-8' : 'ml-24'
      }`}
      style={{
        backgroundImage: `url(${ReplyImage})`,
      }}
    >
      <div
        className={`flex flex-col space-y-2 py-9 px-14
        `}
      >
        <div className={`flex items-center gap-4`}>
          <ProfileBadge
            profileImageUrl={commentReply.profileImageUrl}
            personalId={commentReply.personalId}
            imageSize={30}
          />
          <TimeStamp date={commentReply.createdAt} />
        </div>
        <div className="font-extralight text-s w-[13.4rem] break-words">
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
