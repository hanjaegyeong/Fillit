export interface Reply {
  replyId: number;
  personalId: string;
  profileImageUrl: string | null;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}
