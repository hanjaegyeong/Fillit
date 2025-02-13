import { postCommentReply } from '@/api/comment';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface MutationVariables {
  boardId: number;
  commentId: number;
  content: string;
}

const usePostCommentReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, commentId, content }: MutationVariables) =>
      postCommentReply(boardId, commentId, content),

    onSuccess: (_, { commentId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENT_REPLY_LIST, commentId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENT, commentId],
      });
    },
  });
};

export default usePostCommentReply;
