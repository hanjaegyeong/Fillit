import CommentReplyCard from '@/components/Comment/CommentReplyCard';
import useGetCommentReplyList from '@/hooks/query/useGetCommentReplyList';
import { useParams } from 'react-router-dom';

type RouteParams = {
  boardId: string;
  commentId: string;
};

const CommentReplyListContainer = () => {
  const { boardId, commentId } = useParams() as RouteParams;
  const { data: commentReplyList } = useGetCommentReplyList(boardId, commentId);

  return (
    <div className="flex flex-col items-center">
      {commentReplyList?.map((commentReply, index) => {
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
