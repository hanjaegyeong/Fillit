import { getArticle } from '@/api/article';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Article } from '@/types/article';
import { useQuery } from '@tanstack/react-query';

const useGetArticle = (boardId: string) => {
  return useQuery<Article>({
    queryKey: [QUERY_KEYS.ARTICLE, boardId],
    queryFn: () => getArticle(Number(boardId)),
  });
};

export default useGetArticle;
