import { FeedArticle } from '@/types/article';
import { getBackgroundImage } from '@/utils/getBackgroundImage';
import { useNavigate } from 'react-router-dom';
import ArticleContent from '@/components/Article/ArticleContent';

interface ArticleWrapperProps {
  article: FeedArticle;
  position: 'left' | 'right';
}

const ArticleWrapper = ({ article, position }: ArticleWrapperProps) => {
  const navigate = useNavigate();

  const handleGoArticleDetail = () => {
    navigate(`/article/${article.boardId}`);
  };

  const hasImage = !!article.imageUrls;

  return (
    <div
      className={`bg-contain bg-no-repeat bg-center w-[380px] flex items-center drop-shadow-md ${
        position === 'left' ? 'ml-8' : 'ml-20'
      } -mb-12 pb-1`}
      style={{
        backgroundImage: `url(${getBackgroundImage(hasImage)})`,
      }}
      onClick={handleGoArticleDetail}
    >
      <div
        className={`flex flex-col h-full space-y-2 pl-12 pr-16 ${
          hasImage ? ' pt-20 pb-12 -mt-6' : 'py-12'
        }`}
      >
        <ArticleContent article={article} />
      </div>
    </div>
  );
};

export default ArticleWrapper;
