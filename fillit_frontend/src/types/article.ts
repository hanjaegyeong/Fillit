export interface Article {
  boardId: number;
  content: string;
  personalId: string;
  profileImageUrl: string | null;
  likeCount: number;
  commentCount: number;
  x: number;
  y: number;
  z: number;
  isLiked: boolean;
  keyword: string;
  pageNumber: number;
  imageUrls: string[];
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticlePostForm {
  board: {
    content: string;
    x: number;
    y: number;
    z: number;
    keyword: string;
    pageNumber: number;
    interests: string[];
  };
  boardImages?: File[];
}

export interface FeedArticle {
  boardId: number;
  content: string;
  personalId: string;
  profileImageUrl: string | null;
  likeCount: number;
  commentCount: number;
  keyword: string;
  imageUrl: string;
  createdAt: string;
  isLiked: boolean;
  isRecommended?: boolean;
}
