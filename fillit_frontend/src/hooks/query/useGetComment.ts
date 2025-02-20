import { getComment } from '@/api/comment';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetComment = (boardId: number, commentId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENT, commentId],
    queryFn: () => getComment(boardId, commentId),
  });
};

export default useGetComment;
