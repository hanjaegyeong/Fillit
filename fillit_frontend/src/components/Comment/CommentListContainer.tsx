import CommentCard from '@/components/Comment/CommentCard';
import { useParams } from 'react-router-dom';
import useGetCommentList from '@/hooks/useGetCommentList';

type RouteParams = {
  boardId: string;
};

const CommentListContainer = () => {
  const { boardId } = useParams() as RouteParams;
  const { data: commentList } = useGetCommentList(boardId);

  return (
    <div className="flex flex-col items-center">
      {commentList?.map((comment, index) => {
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
