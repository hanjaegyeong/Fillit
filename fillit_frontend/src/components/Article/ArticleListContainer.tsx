import { articleList } from '@/mocks/fixtures/articleList';
import ArticleCard from '@/components/Article/ArticleCard';

const ArticleListContainer = () => {
  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden scrollbar-hide">
      {articleList.map((article, index) => {
        const position = index % 2 ? 'left' : 'right';

        return (
          <ArticleCard
            key={article.boardId}
            article={article}
            position={position}
          />
        );
      })}
    </div>
  );
};

export default ArticleListContainer;
