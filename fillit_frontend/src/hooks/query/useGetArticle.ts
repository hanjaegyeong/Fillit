import { getArticle } from '@/api/article';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetArticle = (boardId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLE, boardId],
    queryFn: () => getArticle(boardId),
  });
};

export default useGetArticle;
