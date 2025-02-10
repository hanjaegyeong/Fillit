import { commentList } from '@/mocks/fixtures/commentList';
import CommentContent from '@/components/Comment/CommentItem';
import CommentReplyListContainer from '@/components/Comment/CommentReplyListContainer';

const CommentDetailContainer = () => {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden pt-10">
      <div className="pb-1">
        <CommentContent comment={commentList[0]} isDetail />
      </div>
      <CommentReplyListContainer />
    </div>
  );
};

export default CommentDetailContainer;
