import { NotificationType } from '@/constants/notificationType';

export const NOTIFICATION_CONFIG: Record<
  NotificationType,
  { url: (id: number | string) => string; message: string }
> = {
  FOLLOW: { url: (id) => `/profile/${id}`, message: 'started following you.' },
  RECOMMENT: {
    url: (id) => `/comment/${id}`,
    message: 'replied to your comment.',
  },
  COMMENTLIKE: {
    url: (id) => `/comment/${id}`,
    message: 'liked your comment.',
  },
  REPLYLIKE: {
    url: (id) => `/comment/${id}`,
    message: 'liked your reply.',
  },
  CHAT: { url: (id) => `/message/${id}`, message: 'sent you a message.' },
  VOICEREPLY: {
    url: () => '/voice',
    message: 'replied to your voice.',
  },
  BOARDLIKE: { url: (id) => `/article/${id}`, message: 'liked your post.' },
  COMMENT: {
    url: (id) => `/article/${id}`,
    message: 'commented on you.',
  },
};
