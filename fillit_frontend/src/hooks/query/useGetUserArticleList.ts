import { getUserArticleList } from '@/api/article';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetUserArticleList = (personalId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLE_LIST, personalId],
    queryFn: async () => await getUserArticleList(personalId),
  });
};

export default useGetUserArticleList;
