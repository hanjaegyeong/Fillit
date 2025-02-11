import { getArticle } from '@/api/article';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { Article } from '@/types/article';
import { useQuery } from '@tanstack/react-query';

const useGetArticle = (articleId: string) => {
  return useQuery<Article>({
    queryKey: [QUERY_KEYS.ARTICLE, articleId],
    queryFn: () => getArticle(Number(articleId)),
  });
};

export default useGetArticle;
