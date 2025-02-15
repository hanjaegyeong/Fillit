import ArticleWrapper from '@/components/Article/ArticleWrapper';
import { Article } from '@/types/article';
import useGetUserArticleList from '@/hooks/query/useGetUserArticleList';

interface UserArticleListContainerProps {
  personalId: string;
}

const UserArticleListContainer = ({
  personalId,
}: UserArticleListContainerProps) => {
  const { data: articleList } = useGetUserArticleList(personalId);

  return (
    <div className="flex flex-col items-center pt-3 pb-20 w-full">
      {articleList?.map((article: Article, index) => {
        return (
          <div className={`${index % 2 ? 'pl-20' : 'pr-20'}`}>
            <ArticleWrapper key={article.boardId} article={article} />
          </div>
        );
      })}
    </div>
  );
};

export default UserArticleListContainer;
