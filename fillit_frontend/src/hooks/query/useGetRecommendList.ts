import { QUERY_KEYS } from '@/constants/queryKeys';
import { getRecommendArticleList } from '@/api/article';
import { useInfiniteQuery } from '@tanstack/react-query';

const useGetRecommendArticleList = (size: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.RECOMMEND],
    queryFn: ({ pageParam }) =>
      getRecommendArticleList(
        size,
        pageParam.cursorLikeCount,
        pageParam.cursorId,
        pageParam.interestId
      ),
    initialPageParam: {
      cursorLikeCount: null,
      cursorId: null,
      interestId: null,
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.cursorId) return null;
      return {
        cursorLikeCount: lastPage.cursorLikeCount,
        cursorId: lastPage.cursorId,
        interestId: lastPage.interestId,
      };
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export default useGetRecommendArticleList;
