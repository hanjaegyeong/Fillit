import { getCommentList } from '@/api/comment';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetCommentList = (boardId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENT_LIST, boardId],
    queryFn: () => getCommentList(boardId),
    
  });
};

export default useGetCommentList;
