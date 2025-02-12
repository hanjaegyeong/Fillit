import CommentCard from '@/components/Comment/CommentCard';
import CommentReplyListContainer from '@/components/Comment/CommentReplyListContainer';
import { useParams } from 'react-router-dom';
import useGetComment from '@/hooks/query/useGetComment';
import usePostCommentReply from '@/hooks/query/usePostCommentReply';

type RouteParams = {
  boardId: string;
  commentId: string;
};

const CommentDetailContainer = () => {
  const { boardId, commentId } = useParams() as RouteParams;
  const { data: comment } = useGetComment(Number(boardId), Number(commentId));

  const { mutate: addCommentReply } = usePostCommentReply();

  const handleSubmitCommentReply = (content: string) => {
    addCommentReply({
      boardId: Number(boardId),
      commentId: Number(commentId),
      content,
    });
  };

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden pt-10">
      <div className="pb-1">
        {comment && (
          <CommentCard
            comment={comment}
            onSubmit={handleSubmitCommentReply}
            isDetail
          />
        )}
      </div>
      <CommentReplyListContainer />
    </div>
  );
};

export default CommentDetailContainer;
