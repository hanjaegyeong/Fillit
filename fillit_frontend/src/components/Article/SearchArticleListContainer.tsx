import { RecommendIcon } from '@/assets/assets';
import useGetRecommendArticleList from '@/hooks/query/useGetRecommendArticleList';
import useIntersect from '@/hooks/useIntersect';
import { FeedArticle } from '@/types/article';
import ArticleWrapper from '@/components/Article/ArticleWrapper';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';
import useGetSearchArticleList from '@/hooks/query/useGetSearchArticleList';

interface SearchArticleListContainerProps {
  word: string;
}

const SearchArticleListContainer = ({
  word,
}: SearchArticleListContainerProps) => {
  const searchQuery = useGetSearchArticleList(word, 10);
  const recommendQuery = useGetRecommendArticleList(word, 10);

  const { data, fetchNextPage, hasNextPage, isFetching } = word
    ? searchQuery
    : recommendQuery;

  const pageEnd = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);

    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  return (
    <>
      <div
        className={`flex flex-col items-center pb-20 w-full overflow-x-hidden ${
          word ? 'pt-4' : ''
        }`}
      >
        {word ? (
          <></>
        ) : (
          <div className="w-full max-w-[600px] flex items-center justify-start pl-4 pt-2 pb-1.5">
            <img src={RecommendIcon} alt="recommend-icon" className="size-8 " />
            <p className="text-left text-white pl-1 font-light text-xl tracking-tight text-shadow-sm">
              Recommended content
            </p>
          </div>
        )}

        {data?.pages?.[0]?.responses?.length === 0 ? (
          <div className="h-screen flex items-center justify-center">
            {word ? (
              <p className="text-2xl text-gray-600">No results found...</p>
            ) : null}
          </div>
        ) : (
          data?.pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page.responses.map((article: FeedArticle, index: number) => {
                return (
                  <div
                    key={article.boardId}
                    className={`${index % 2 ? 'pl-20' : 'pr-20'}`}
                  >
                    <ArticleWrapper article={article} />
                  </div>
                );
              })}
            </div>
          ))
        )}

        {hasNextPage && <div ref={pageEnd} style={{ height: 1 }} />}
        {isFetching && (
          <div className="h-8 pt-14">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchArticleListContainer;
