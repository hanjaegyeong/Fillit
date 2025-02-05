import { commentList } from '@/mocks/fixtures/commentList';
import CommentItem from '@/components/Comment/CommentItem';

const CommentListContainer = () => {
  return (
    <div className="flex flex-col items-center">
      {commentList.map((comment, index) => {
        const position = index % 2 ? 'right' : 'left';
        return (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            position={position}
          />
        );
      })}
    </div>
  );
};

export default CommentListContainer;
