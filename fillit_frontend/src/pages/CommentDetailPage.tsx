import CommentDetailContainer from '@/components/Comment/CommentDetailContainer';
import Header from '@/components/common/Header/Header';

const CommentDetailPage = () => {
  return (
    <div className="container-header-nav">
      <Header left="back" />
      <CommentDetailContainer />
    </div>
  );
};

export default CommentDetailPage;
