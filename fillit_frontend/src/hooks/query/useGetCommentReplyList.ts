import { getCommentReplyList } from '@/api/comment';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetCommentReplyList = (boardId: number, commentId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENT_REPLY_LIST, commentId],
    queryFn: () => getCommentReplyList(boardId, commentId),
  });
};

export default useGetCommentReplyList;
