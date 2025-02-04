import { Article } from '@/types/article';
import { getBackgroundImage } from '@/utils/getBackgroundImage';
import { useNavigate } from 'react-router-dom';
import ArticleContent from './ArticleContent';

interface ArticleItemProps {
  article: Article;
  position: 'left' | 'right';
}

const ArticleCard = ({ article, position }: ArticleItemProps) => {
  const navigate = useNavigate();

  const handleGoArticleDetail = () => {
    navigate(`/article/${article.boardId}`);
  };

  const hasImage = !!article.imageUrls[0];

  return (
    <div
      className={`bg-contain bg-no-repeat bg-center w-[380px] flex items-center drop-shadow-md ${
        position === 'left' ? 'mr-16' : 'ml-16'
      } -mb-12 pb-1`}
      style={{
        backgroundImage: `url(${getBackgroundImage(hasImage)})`,
      }}
      onClick={handleGoArticleDetail}
    >
      <div
        className={`flex flex-col h-full space-y-2 px-10 ${
          hasImage ? ' pt-20 pb-12 -mt-6' : 'py-12'
        }`}
      >
        <ArticleContent article={article} />
      </div>
    </div>
  );
};

export default ArticleCard;
