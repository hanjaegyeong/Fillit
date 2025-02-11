import { commentList } from '@/mocks/fixtures/commentList';
import CommentCard from '@/components/Comment/CommentCard';
import CommentReplyListContainer from '@/components/Comment/CommentReplyListContainer';

const CommentDetailContainer = () => {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden pt-10">
      <div className="pb-1">
        <CommentCard comment={commentList[0]} isDetail />
      </div>
      <CommentReplyListContainer />
    </div>
  );
};

export default CommentDetailContainer;
