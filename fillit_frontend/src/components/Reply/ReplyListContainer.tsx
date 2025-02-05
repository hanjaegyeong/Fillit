import { replyList } from '@/mocks/fixtures/replyList';
import ReplyItem from '@/components/Reply/ReplyItem';

const ReplyListContainer = () => {
  return (
    <div className="flex flex-col items-center">
      {replyList.map((reply, index) => {
        const position = index % 2 ? 'left' : 'right';
        return (
          <ReplyItem key={reply.replyId} reply={reply} position={position} />
        );
      })}
    </div>
  );
};

export default ReplyListContainer;
