import ArticleWrapper from '@/components/Article/ArticleWrapper';
import useGetFeed from '@/hooks/query/useGetFeed';
import useIntersect from '@/hooks/useIntersect';
import { FeedArticle } from '@/types/article';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';

const ArticleListContainer = () => {
  const { data, hasNextPage, isFetching, fetchNextPage } = useGetFeed(10);

  const pageEnd = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);

    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  return (
    <div className="flex flex-col items-center pt-3 pb-20 w-full overflow-x-hidden">
      {data?.pages?.length ? (
        data.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.posts.map((article: FeedArticle, index: number) => {
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
  );
};

export default ArticleListContainer;
