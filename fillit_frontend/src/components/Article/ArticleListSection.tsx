import { articleList } from '@/mocks/fixtures/articleList';
import ArticleItem from '@/components/Article/ArticleItem';

const ArticleListSection = () => {
  return (
    <div className="overflow-x-hidden py-2">
      {articleList.map((item, index) => {
        const position = index % 2 ? 'left' : 'right';

        return (
          <ArticleItem key={item.boardId} article={item} position={position} />
        );
      })}
    </div>
  );
};

export default ArticleListSection;
