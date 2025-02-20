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
      className={`bg-contain bg-no-repeat bg-center w-[20.5rem] flex items-center -mt-12 drop-shadow-[0px_0px_1px_rgba(0,0,0,0.2)] ${
        position === 'left' ? 'ml-4' : 'ml-24'
      }`}
      style={{
        backgroundImage: `url(${ReplyImage})`,
      }}
    >
      <div className="flex flex-col space-y-2 pt-6 pb-10 px-14">
        <div className={`flex items-center gap-4`}>
          <ProfileBadge
            profileImageUrl={commentReply.profileImageUrl}
            personalId={commentReply.personalId}
            imageSize={30}
          />
        </div>
        <div className="font-extralight text-s w-[14rem] break-words px-2 leading-tight">
          {commentReply.content}
        </div>
        <div className="flex justify-between pt-1.5">
          <LikeBadge
            type="reply"
            id={commentReply.replyId}
            initialLikeCount={commentReply.likeCount}
            initialIsLiked={commentReply.isLiked}
            size="small"
          />
          <TimeStamp date={commentReply.createdAt} />
        </div>
      </div>
    </div>
  );
};

export default CommentReplyCard;
