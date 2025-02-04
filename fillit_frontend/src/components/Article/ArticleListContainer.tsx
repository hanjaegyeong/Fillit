import { articleList } from '@/mocks/fixtures/articleList';
import ArticleCard from '@/components/Article/ArticleCard';

const ArticleListContainer = () => {
  return (
    <div className="flex flex-col items-center overflow-x-hidden w-full">
      {articleList.map((item, index) => {
        const position = index % 2 ? 'left' : 'right';

        return (
          <ArticleCard key={item.boardId} article={item} position={position} />
        );
      })}
    </div>
  );
};

export default ArticleListContainer;
