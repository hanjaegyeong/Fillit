import { getComment } from '@/api/comment';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetComment = (boardId: string, commentId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENT, commentId],
    queryFn: () => getComment(Number(boardId), Number(commentId)),
  });
};

export default useGetComment;
