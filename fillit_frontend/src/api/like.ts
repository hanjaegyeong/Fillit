import axiosInstance from '@/api/axiosInstance';

/* 게시글 좋아요 */
export const postArticleLike = async (boardId: number) => {
  const response = await axiosInstance.post(`/api/boards/${boardId}/likes`);
  return response.data;
};

/* 게시글 좋아요 취소 */
export const deleteArticleLike = async (boardId: number) => {
  const response = await axiosInstance.delete(`/api/boards/${boardId}/likes`);
  return response.data;
};

/* 게시글 좋아요 리스트 조회 */
export const getArticleLikeList = async (boardId: number) => {
  const response = await axiosInstance.get(`/api/boards/${boardId}/likes`);
  return response.data;
};

/* 댓글 좋아요 */
export const postCommentLike = async (commentId: number) => {
  const response = await axiosInstance.post(`/api/comments/${commentId}/likes`);
  return response.data;
};

/* 댓글 좋아요 취소 */
export const deleteCommentLike = async (commentId: number) => {
  const response = await axiosInstance.delete(
    `/api/comments/${commentId}/likes`
  );
  return response.data;
};

/* 댓글 좋아요 리스트 조회 */
export const getCommentLikeList = async (commentId: number) => {
  const response = await axiosInstance.get(`/api/comments/${commentId}/likes`);
  return response.data;
};

/* 대댓글 좋아요 */
export const postCommentReplyLike = async (replyId: number) => {
  const response = await axiosInstance.post(`/api/replys/${replyId}/likes`);
  return response.data;
};

/* 대댓글 좋아요 취소 */
export const deleteCommentReplyLike = async (replyId: number) => {
  const response = await axiosInstance.delete(`/api/replys/${replyId}/likes`);
  return response.data;
};

/* 대댓글 좋아요 리스트 조회 */
export const getCommentReplyLikeList = async (replyId: number) => {
  const response = await axiosInstance.get(`/api/replys/${replyId}/likes`);
  return response.data;
};
