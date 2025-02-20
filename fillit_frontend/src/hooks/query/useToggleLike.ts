import {
  deleteArticleLike,
  deleteCommentLike,
  deleteCommentReplyLike,
  postArticleLike,
  postCommentLike,
  postCommentReplyLike,
} from '@/api/like';
import { useMutation } from '@tanstack/react-query';

interface MutationVariables {
  type: 'article' | 'comment' | 'reply';
  id: number;
  isLiked: boolean;
}

const useToggleArticleLike = () => {
  return useMutation({
    mutationFn: async ({ type, id, isLiked }: MutationVariables) => {
      switch (type) {
        case 'article':
          isLiked ? postArticleLike(id) : deleteArticleLike(id);
          break;
        case 'comment':
          isLiked ? postCommentLike(id) : deleteCommentLike(id);
          break;
        case 'reply':
          isLiked ? postCommentReplyLike(id) : deleteCommentReplyLike(id);
          break;
      }
    },
  });
};

export default useToggleArticleLike;
