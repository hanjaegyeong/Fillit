import { getCommentList } from '@/api/comment';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetCommentList = (boardId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENT_LIST],
    queryFn: () => getCommentList(Number(boardId)),
  });
};

export default useGetCommentList;
