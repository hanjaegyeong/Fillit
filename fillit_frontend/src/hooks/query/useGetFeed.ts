import { QUERY_KEYS } from '@/constants/queryKeys';
import { getFeed } from '@/api/article';
import { useInfiniteQuery } from '@tanstack/react-query';

const useGetFeed = (limit: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.FEED],
    queryFn: ({ pageParam = null }) => getFeed(limit, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export default useGetFeed;
