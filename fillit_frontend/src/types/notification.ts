export interface HistoryTime {
  time: number;
  date: number;
  month: number;
  year: number;
}

export interface History {
  id: number;
  userId: number;
  userName: string;
  userProfile: string;
  type: 'like' | 'comment' | 'commentLike' | 'follow';
  contentId: number;
  timestamp: HistoryTime[];
}
