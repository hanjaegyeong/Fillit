import axiosInstance from '@/api/axiosInstance';
import { Article, ArticlePostForm } from '@/types/article';

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

/* 유저 게시글 리스트 조회 */
export const getUserArticleList = async (
  personalId: string
): Promise<Article[]> => {
  const response = await axiosInstance.get(`/api/board/${personalId}/user`);
  return response.data;
};

/* 피드 게시글 조회 */
export const getFeed = async (
  limit: number,
  cursorFollow: string | null,
  cursorRecommend: string | null
) => {
  const response = await axiosInstance.get('/api/feed', {
    params: { limit, cursorFollow, cursorRecommend },
  });
  return response.data;
};

/* 추천 게시글 리스트 조회 */
export const getRecommendArticleList = async (
  size: number,
  cursorLikeCount: number | null,
  cursorId: number | null,
  interestId: number | null
) => {
  const response = await axiosInstance.get('/api/board/recommend', {
    params: { size, cursorLikeCount, cursorId, interestId },
  });
  return response.data;
};

/* 검색 게시글 리스트 조회 */
export const getSearchArticleList = async (
  word: string,
  size: number,
  cursorId: number | null
) => {
  const response = await axiosInstance.get(`/api/board/search`, {
    params: { word, size, cursorId },
  });
  return response.data;
};

/* 게시글 프로필 위치 수정 */
export const patchArticlePosition = async (
  positionUpdateList: {
    boardId: number;
    x: number;
    y: number;
    z: number;
    pageNumber: number;
  }[]
) => {
  const response = await axiosInstance.patch(
    '/api/board/profile/update',
    positionUpdateList
  );
  return response.data;
};
