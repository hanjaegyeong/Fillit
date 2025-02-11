import CommentCard from '@/components/Comment/CommentCard';
import CommentReplyListContainer from '@/components/Comment/CommentReplyListContainer';
import { useParams } from 'react-router-dom';
import useGetComment from '@/hooks/useGetComment';

type RouteParams = {
  boardId: string;
  commentId: string;
};

const CommentDetailContainer = () => {
  const { boardId, commentId } = useParams() as RouteParams;
  const { data: comment } = useGetComment(boardId, commentId);

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden pt-10">
      <div className="pb-1">
        {comment && <CommentCard comment={comment} isDetail />}
      </div>
      <CommentReplyListContainer />
    </div>
  );
};

export default CommentDetailContainer;
