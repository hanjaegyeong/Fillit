import { useParams } from 'react-router-dom';
import ArticleContent from '@/components/Article/ArticleContent';
import ProfileImage from '@/components/common/ProfileImage';
import CommentListContainer from '@/components/Comment/CommentListContainer';
import useGetArticle from '@/hooks/query/useGetArticle';
import SubmitInput from '@/components/common/Input/SubmitInput';
import usePostComment from '@/hooks/query/usePostComment';
import { COMMENT_MAX_LENGTH } from '@/constants/system';
import { useUserStore } from '@/store/useUserStore';

type RouteParams = {
  boardId: string;
};

const ArticleDetailContainer = () => {
  const { boardId } = useParams() as RouteParams;
  const { user } = useUserStore();
  console.log(user.profileImageUrl);
  const { data: article } = useGetArticle(Number(boardId));
  const { mutate: addComment } = usePostComment();

  const handleCommentSubmit = (content: string) => {
    addComment({ boardId: Number(boardId), content });
  };

  return (
    <div className="w-full overflow-auto overflow-x-hidden">
      <div className="m-5 bg-white border border-black rounded-md">
        <div className="p-5 space-y-6">
          {article && <ArticleContent article={article} isDetail />}
        </div>
        <hr className="border-t border-black" />
        <div className="flex gap-3 p-4">
          <ProfileImage src={user.profileImageUrl} size={40} />
          <SubmitInput
            placeholder="Write a comment..."
            onSubmit={handleCommentSubmit}
            maxLength={COMMENT_MAX_LENGTH}
          />
        </div>
        <div className="pt-8 pb-4">
          <CommentListContainer />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailContainer;
