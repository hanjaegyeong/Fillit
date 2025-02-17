import { QUERY_KEYS } from '@/constants/queryKeys';
import { getFeed } from '@/api/article';
import { useInfiniteQuery } from '@tanstack/react-query';

const useGetFeed = (limit: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.FEED],
    queryFn: ({ pageParam }) =>
      getFeed(limit, pageParam.cursorFollow, pageParam.cursorRecommend),
    initialPageParam: {
      cursorFollow: null,
      cursorRecommend: null,
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.nextCursor) return null;
      return {
        cursorFollow: lastPage.nextCursor,
        cursorRecommend: lastPage.nextCursorRecommend,
      };
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useGetFeed;
