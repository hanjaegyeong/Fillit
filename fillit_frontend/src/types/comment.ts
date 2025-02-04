export interface Comment {
  commentId: number;
  content: string;
  personalId: string;
  profileImageUrl: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}
