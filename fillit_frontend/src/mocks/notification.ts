import { History, HistoryTime } from '@/types/notification';
import ProfileImage from '@/mocks/images/profile-image.png';

const getHistoryTimeOffset = (
  offsetDays: number,
  offsetHour: number
): HistoryTime => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  d.setHours(offsetHour);
  return {
    time: d.getHours(),
    date: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
};

export const mockHistory: History[] = [
  {
    id: 1,
    userId: 1,
    userName: 'Alice',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 1,
    timestamp: [getHistoryTimeOffset(0, 10)], // 오늘 10시
  },
  {
    id: 2,
    userId: 2,
    userName: 'Bob',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 1,
    timestamp: [getHistoryTimeOffset(2, 9)], // 2일 전 9시
  },
  {
    id: 3,
    userId: 3,
    userName: 'Charlie',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 2,
    timestamp: [getHistoryTimeOffset(1, 12)], // 1일 전 12시
  },
  {
    id: 4,
    userId: 4,
    userName: 'David',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 2,
    timestamp: [getHistoryTimeOffset(6, 15)], // 6일 전 15시
  },
  {
    id: 5,
    userId: 5,
    userName: 'Eve',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 3,
    timestamp: [getHistoryTimeOffset(8, 16)], // 8일 전 16시
  },
  {
    id: 6,
    userId: 6,
    userName: 'Frank',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 4,
    timestamp: [getHistoryTimeOffset(20, 14)], // 20일 전 14시
  },
  {
    id: 7,
    userId: 7,
    userName: 'Grace',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 5,
    timestamp: [getHistoryTimeOffset(40, 11)], // 40일 전 11시
  },
  {
    id: 8,
    userId: 8,
    userName: 'Heidi',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 6,
    timestamp: [getHistoryTimeOffset(0, 13)], // 오늘 13시
  },
  {
    id: 9,
    userId: 9,
    userName: 'Ivan',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 6,
    timestamp: [getHistoryTimeOffset(0, 10)], // 오늘 10시
  },
  {
    id: 10,
    userId: 10,
    userName: 'Judy',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 6,
    timestamp: [getHistoryTimeOffset(3, 17)], // 3일 전 17시
  },
  {
    id: 11,
    userId: 11,
    userName: 'Alice',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 7,
    timestamp: [getHistoryTimeOffset(0, 10)], // 오늘 10시
  },
  {
    id: 12,
    userId: 12,
    userName: 'Bob',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 7,
    timestamp: [getHistoryTimeOffset(2, 9)], // 2일 전 9시
  },
  {
    id: 13,
    userId: 13,
    userName: 'Charlie',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 8,
    timestamp: [getHistoryTimeOffset(1, 12)], // 1일 전 12시
  },
  {
    id: 14,
    userId: 14,
    userName: 'David',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 9,
    timestamp: [getHistoryTimeOffset(6, 15)], // 6일 전 15시
  },
  {
    id: 15,
    userId: 15,
    userName: 'Eve',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 9,
    timestamp: [getHistoryTimeOffset(8, 16)], // 8일 전 16시
  },
  {
    id: 16,
    userId: 16,
    userName: 'Frank',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 9,
    timestamp: [getHistoryTimeOffset(20, 14)], // 20일 전 14시
  },
  {
    id: 17,
    userId: 17,
    userName: 'Grace',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 10,
    timestamp: [getHistoryTimeOffset(40, 11)], // 40일 전 11시
  },
  {
    id: 18,
    userId: 18,
    userName: 'Heidi',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 10,
    timestamp: [getHistoryTimeOffset(0, 13)], // 오늘 13시
  },
  {
    id: 19,
    userId: 19,
    userName: 'Ivan',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 10,
    timestamp: [getHistoryTimeOffset(0, 10)], // 오늘 10시
  },
  {
    id: 20,
    userId: 20,
    userName: 'Judy',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 10,
    timestamp: [getHistoryTimeOffset(3, 17)], // 3일 전 17시
  },
  // follow 타입 알림 추가
  {
    id: 21,
    userId: 21,
    userName: 'Kate',
    userProfile: ProfileImage,
    type: 'follow',
    contentId: 11, // follow 타입은 contentId가 그룹화 키로 사용되지만, 실제 라우팅은 userId 기반
    timestamp: [getHistoryTimeOffset(0, 11)], // 오늘 11시
  },
];
