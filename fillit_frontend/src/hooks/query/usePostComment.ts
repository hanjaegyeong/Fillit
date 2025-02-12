import { postComment } from '@/api/comment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';

interface MutationVariables {
  boardId: number;
  content: string;
}

const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, content }: MutationVariables) =>
      postComment(boardId, content),

    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENT_LIST, boardId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ARTICLE, boardId],
      });
    },
  });
};

export default usePostComment;
