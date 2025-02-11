import { commentReplyList } from '@/mocks/fixtures/commentReplyList';
import CommentReplyCard from '@/components/Comment/CommentReplyCard';

const CommentReplyListContainer = () => {
  return (
    <div className="flex flex-col items-center">
      {commentReplyList.map((commentReply, index) => {
        const position = index % 2 ? 'left' : 'right';
        return (
          <CommentReplyCard
            key={commentReply.replyId}
            commentReply={commentReply}
            position={position}
          />
        );
      })}
    </div>
  );
};

export default CommentReplyListContainer;
