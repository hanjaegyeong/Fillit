import { QUERY_KEYS } from '@/constants/queryKeys';
import { getFeed } from '@/api/article';
import { useInfiniteQuery } from '@tanstack/react-query';

const useGetFeed = (limit: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.FEED],
    queryFn: ({ pageParam }) => getFeed(limit, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useGetFeed;
