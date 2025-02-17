import { Article, FeedArticle } from '@/types/article';
import { getBackgroundImage } from '@/utils/getBackgroundImage';
import { useNavigate } from 'react-router-dom';
import ArticleContent from '@/components/Article/ArticleContent';

interface ArticleWrapperProps {
  article: FeedArticle | Article;
}

const ArticleWrapper = ({ article }: ArticleWrapperProps) => {
  const navigate = useNavigate();

  const handleGoArticleDetail = () => {
    navigate(`/article/${article.boardId}`);
  };

  const hasImage =
    ('imageUrl' in article && !!article.imageUrl) ||
    ('imageUrls' in article && !!article.imageUrls[0]);

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
          hasImage ? ' pt-20 pb-10 ' : 'py-[2.7rem]'
        }`}
      >
        <ArticleContent article={article} />
      </div>
    </div>
  );
};

export default ArticleWrapper;
