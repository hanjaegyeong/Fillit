import { RecommendIcon } from '@/assets/assets';
import useGetRecommendArticleList from '@/hooks/query/useGetRecommendArticleList';
import useIntersect from '@/hooks/useIntersect';
import { FeedArticle } from '@/types/article';
import ArticleWrapper from '@/components/Article/ArticleWrapper';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

const SearchArticleListContainer = () => {
  const { data, hasNextPage, isFetching, fetchNextPage } =
    useGetRecommendArticleList(10);

  const pageEnd = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);

    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  return (
    <>
      <div className="flex flex-col items-center pb-20 w-full overflow-x-hidden">
        <div className="w-full max-w-[600px] flex items-end justify-start pl-4 pt-2 -mb-3">
          <img src={RecommendIcon} alt="recommend-icon" className="size-8 " />
          <p className="text-left text-white pl-1 font-light text-xl tracking-tight text-shadow-sm">
            Recommended content
          </p>
        </div>
        {data?.pages?.length ? (
          data.pages.map((page, pageIndex) => (
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
        ) : (
          <></>
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
