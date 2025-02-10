import axiosInstance from '@/api/axiosInstance';
import { Comment, CommentReply } from '@/types/comment';

/* 댓글 작성 */
export const postComment = async (
  boardId: number,
  comments: string
): Promise<Comment> => {
  const response = await axiosInstance.post(`/api/board/${boardId}/comment`, {
    comments,
  });
  return response.data;
};

/* 댓글 리스트 조회 */
export const getCommentList = async (boardId: number): Promise<Comment[]> => {
  const response = await axiosInstance.get(`/api/board/${boardId}/comment`);
  return response.data;
};

/* 댓글 조회 */
export const getComment = async (
  boardId: number,
  commentId: number
): Promise<Comment> => {
  const response = await axiosInstance.get(
    `/api/board/${boardId}/comment/${commentId}`
  );
  return response.data;
};

/* 댓글 삭제 */
export const deleteComment = async (boardId: number, commentId: number) => {
  const response = await axiosInstance.delete(
    `/api/board/${boardId}/comment/${commentId}`
  );
  return response.data;
};

/* 대댓글 작성 */
export const postCommentReply = async (
  boardId: number,
  commentId: number,
  comments: string
): Promise<CommentReply> => {
  const response = await axiosInstance.post(
    `/api/board/${boardId}/comment/${commentId}/replies`,
    {
      comments,
    }
  );
  return response.data;
};

/* 대댓글 리스트 조회 */
export const getCommentReplyList = async (
  boardId: number,
  commentId: number
): Promise<CommentReply[]> => {
  const response = await axiosInstance.get(
    `/api/board/${boardId}/comment/${commentId}/replies`
  );
  return response.data;
};

/* 대댓글 삭제 */
export const deleteCommentReply = async (
  boardId: number,
  commentId: number,
  replyId: number
) => {
  const response = await axiosInstance.post(
    `/api/board/${boardId}/comment/${commentId}/replies/${replyId}`
  );
  return response.data;
};
