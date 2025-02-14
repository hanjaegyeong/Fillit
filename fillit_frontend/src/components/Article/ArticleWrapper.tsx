import { FeedArticle } from '@/types/article';
import { getBackgroundImage } from '@/utils/getBackgroundImage';
import { useNavigate } from 'react-router-dom';
import ArticleContent from '@/components/Article/ArticleContent';

interface ArticleWrapperProps {
  article: FeedArticle;
}

const ArticleWrapper = ({ article }: ArticleWrapperProps) => {
  const navigate = useNavigate();

  const handleGoArticleDetail = () => {
    navigate(`/article/${article.boardId}`);
  };

  const hasImage = !!article.imageUrl;

  return (
    <div
      className={`bg-contain bg-no-repeat bg-center w-[23.75rem] flex items-center justify-center drop-shadow-md -mb-12`}
      style={{
        backgroundImage: `url(${getBackgroundImage(hasImage)})`,
      }}
      onClick={handleGoArticleDetail}
    >
      <div
        className={`flex flex-col h-full space-y-2 ${
          hasImage ? ' pt-20 pb-10 ' : 'py-12'
        }`}
      >
        <ArticleContent article={article} />
      </div>
    </div>
  );
};

export default ArticleWrapper;
