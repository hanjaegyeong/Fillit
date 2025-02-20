import { NotificationType } from '@/constants/notificationType';

export interface Notification {
  notificationId: number;
  receiverPersonalId: string;
  senderPersonalId: string;
  senderProfileImageUrl: string;
  type: NotificationType;
  referenceId: number;
  createdAt: string;
  isRead: boolean;
}
