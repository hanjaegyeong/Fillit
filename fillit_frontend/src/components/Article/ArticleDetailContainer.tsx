import { useParams } from 'react-router-dom';
import ArticleContent from './ArticleContent';
import { articleList } from '@/mocks/fixtures/articleList';
import { commentList } from '@/mocks/fixtures/commentList';
import CommentContent from '../Comment/CommentContent';

type RouteParams = {
  boardId: string;
};

const ArticleDetailContainer = () => {
  const { boardId } = useParams() as RouteParams;

  return (
    <div className="w-full overflow-auto">
      <div className="m-5 bg-white border border-black rounded-md">
        <div className="p-5 space-y-6">
          <ArticleContent article={articleList[Number(boardId)]} isDetail />
        </div>
        <hr className="border-t border-black" />
        <div className="p-4">
          <div className="text-center border border-black  rounded-full">
            댓글입력창
          </div>
          {commentList.map((comment) => (
            <CommentContent key={comment.commentId} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailContainer;
