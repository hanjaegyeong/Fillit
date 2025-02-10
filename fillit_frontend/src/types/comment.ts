export interface CommentType {
  content: string;
  personalId: string;
  profileImageUrl: string | null;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment extends CommentType {
  commentId: number;
  commentReplyCount: number;
}

export interface CommentReply extends CommentType {
  replyId: number;
}
