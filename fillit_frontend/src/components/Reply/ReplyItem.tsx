import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import TimeStamp from '@/components/common/Timestamp';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import ReplyImage from '@/assets/images/reply-bg.png';
import { Reply } from '@/types/reply';

interface ReplyItemProps {
  reply: Reply;
  position?: 'left' | 'right';
}

const ReplyItem = ({ reply, position = 'left' }: ReplyItemProps) => {
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
            profileImageUrl={reply.profileImageUrl}
            personalId={reply.personalId}
            imageSize={27}
          />
          <TimeStamp date={reply.createdAt} />
        </div>
        <div className="font-extralight text-xxs w-[13.4rem]">
          {reply.content}
        </div>
        <div className="flex justify-end">
          <LikeBadge likeCount={reply.likeCount} isLiked={true} size="small" />
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;
