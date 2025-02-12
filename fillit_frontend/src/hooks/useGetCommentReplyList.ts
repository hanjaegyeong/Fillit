import { getCommentReplyList } from '@/api/comment';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useGetCommentReplyList = (boardId: string, commentId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMMENT_REPLY_LIST],
    queryFn: () => getCommentReplyList(Number(boardId), Number(commentId)),
  });
};

export default useGetCommentReplyList;
