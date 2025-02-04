import { useParams } from 'react-router-dom';
import ArticleContent from '@/components/Article/ArticleContent';
import { articleList } from '@/mocks/fixtures/articleList';
import { commentList } from '@/mocks/fixtures/commentList';
import CommentContent from '@/components/Comment/CommentContent';
import ProfileImage from '@/components/common/ProfileImage';
import { SendIcon } from '@/assets/assets';

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
          <div className="relative flex gap-3 pb-10">
            <ProfileImage size={40} />
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 border-[0.05rem] px-4 border-black rounded-full placeholder:text-sm  placeholder:text-gray-300 placeholder:font-light focus:outline-none"
            />
            <button className="p-2 absolute right-2 top-1">
              <img src={SendIcon} alt="send icon" />
            </button>
          </div>
          <div className="flex flex-col items-center">
            {commentList.map((comment, index) => {
              const position = index % 2 ? 'right' : 'left';
              return (
                <CommentContent
                  key={comment.commentId}
                  comment={comment}
                  position={position}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailContainer;
