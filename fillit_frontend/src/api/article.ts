import axiosInstance from '@/api/axiosInstance';
import { Article, ArticlePostForm } from '@/types/article';

/* 피드 게시글 조회 */
export const getFeed = async (limit: number, cursor: string) => {
  const response = await axiosInstance.get('/api/feed', {
    params: { limit, cursor },
  });
  return response.data;
};

/* 게시글 작성 */
export const postArticle = async (
  articlePostForm: ArticlePostForm
): Promise<Article> => {
  const formData = new FormData();
  formData.append(
    'board',
    new Blob([JSON.stringify(articlePostForm.board)], {
      type: 'application/json',
    })
  );
  if (articlePostForm.boardImages) {
    articlePostForm.boardImages.forEach((image) =>
      formData.append('boardImages', image)
    );
  }

  const response = await axiosInstance.post('/api/board', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/* 게시글 조회 */
export const getArticle = async (boardId: number): Promise<Article> => {
  const response = await axiosInstance.get(`/api/board/${boardId}`);
  return response.data;
};

/* 게시글 수정 */
export const putArticle = async (
  boardId: number,
  articlePostForm: ArticlePostForm
): Promise<Article> => {
  const formData = new FormData();
  formData.append(
    'board',
    new Blob([JSON.stringify(articlePostForm.board)], {
      type: 'application/json',
    })
  );

  if (articlePostForm.boardImages) {
    articlePostForm.boardImages.forEach((image) =>
      formData.append('boardImages', image)
    );
  }
  const response = await axiosInstance.put(`/api/board/${boardId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/* 게시글 삭제 */
export const deleteArticle = async (boardId: number) => {
  const response = await axiosInstance.delete(`/api/board/${boardId}`);
  return response.data;
};
