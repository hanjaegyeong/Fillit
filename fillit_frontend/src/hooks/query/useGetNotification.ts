import { getNotification } from '@/api/notification';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useInfiniteQuery } from '@tanstack/react-query';

const useGetNotification = (size: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.NOTIFICATION],
    queryFn: ({ pageParam }) => getNotification(size, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursorId ?? undefined,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useGetNotification;
