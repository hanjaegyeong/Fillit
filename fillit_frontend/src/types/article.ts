export interface Article {
  boardId: number;
  content: string;
  personalId: string;
  profileImageUrl?: string | null;
  likeCount: number;
  commentCount: number;
  x: number;
  y: number;
  z: number;
  keyword: string;
  pageNumber: number;
  imageUrls?: string[] | null;
  createdAt: string;
  updatedAt: string;
}
