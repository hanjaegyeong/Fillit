import ArticleWrapper from '@/components/Article/ArticleWrapper';
import { Article } from '@/types/article';
import useGetUserArticleList from '@/hooks/query/useGetUserArticleList';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

interface UserArticleListContainerProps {
  personalId: string;
}

const UserArticleListContainer = ({
  personalId,
}: UserArticleListContainerProps) => {
  const { data: articleList, isLoading } = useGetUserArticleList(personalId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-3 pb-20 w-full">
      {articleList && articleList?.length > 0 ? (
        articleList.map((article: Article, index) => {
          return (
            <div className={`${index % 2 ? 'pl-20' : 'pr-20'}`}>
              <ArticleWrapper key={article.boardId} article={article} />
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-2xl text-gray-600">No articles yet...</p>
        </div>
      )}
    </div>
  );
};

export default UserArticleListContainer;
