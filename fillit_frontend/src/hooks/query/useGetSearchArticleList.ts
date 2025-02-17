import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getSearchArticleList } from '@/api/article';

const useGetSearchArticleList = (word: string, size: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SEARCH_ARTICLE, word],
    queryFn: ({ pageParam }) => getSearchArticleList(word, size, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.cursorId ?? undefined,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !!word,
  });
};

export default useGetSearchArticleList;
