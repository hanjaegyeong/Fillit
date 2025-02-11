import ArticleCard from '@/components/Article/ArticleCard';
import useGetFeed from '@/hooks/useGetFeed';
import useIntersect from '@/hooks/useIntersect';
import { FeedArticle } from '@/types/article';

const ArticleListContainer = () => {
  const { data, hasNextPage, isFetching, fetchNextPage } = useGetFeed(10);

  const pageEnd = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);

    await new Promise((resolve) => setTimeout(resolve, 500));

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
        ))
      ) : (
        <></>
      )}

      {hasNextPage && <div ref={pageEnd} style={{ height: 1 }} />}
      {isFetching && <p>loading...</p>}
    </div>
  );
};

export default ArticleListContainer;
