import { commentList } from '@/mocks/fixtures/commentList';
import CommentCard from '@/components/Comment/CommentCard';

const CommentListContainer = () => {
  return (
    <div className="flex flex-col items-center">
      {commentList.map((comment, index) => {
        const position = index % 2 ? 'right' : 'left';
        return (
          <CommentCard
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
