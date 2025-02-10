import { commentReplyList } from '@/mocks/fixtures/commentReplyList';
import CommentReplyItem from '@/components/Comment/CommentReplyItem';

const CommentReplyListContainer = () => {
  return (
    <div className="flex flex-col items-center">
      {commentReplyList.map((commentReply, index) => {
        const position = index % 2 ? 'left' : 'right';
        return (
          <CommentReplyItem
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
