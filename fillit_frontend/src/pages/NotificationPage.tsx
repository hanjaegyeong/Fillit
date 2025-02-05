import React from 'react';
import Header from '@/components/common/Header/Header';
import ProfileImage from '@/mocks/images/profile-image.png';

interface HistoryTime {
  time: number;
  date: number;
  month: number;
  year: number;
}

interface History {
  id: number;
  userName: string;
  userProfile: string;
  type: string;
  contentId: number;
  timestamp: HistoryTime[];
}

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

const mockHistory: History[] = [
  // 그룹 1: contentId 1, type 'like'
  {
    id: 1,
    userName: 'Alice',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 1,
    timestamp: [getHistoryTimeOffset(0, 10)], // 오늘 10시
  },
  {
    id: 2,
    userName: 'Bob',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 1,
    timestamp: [getHistoryTimeOffset(2, 9)], // 2일 전 9시
  },
  // 그룹 2: contentId 2, type 'comment'
  {
    id: 3,
    userName: 'Charlie',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 2,
    timestamp: [getHistoryTimeOffset(1, 12)], // 1일 전 12시
  },
  {
    id: 4,
    userName: 'David',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 2,
    timestamp: [getHistoryTimeOffset(6, 15)], // 6일 전 15시
  },
  // 그룹 3: contentId 3, type 'commentLike'
  {
    id: 5,
    userName: 'Eve',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 3,
    timestamp: [getHistoryTimeOffset(8, 16)], // 8일 전 16시
  },
  // 그룹 4: contentId 4, type 'like'
  {
    id: 6,
    userName: 'Frank',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 4,
    timestamp: [getHistoryTimeOffset(20, 14)], // 20일 전 14시
  },
  // 그룹 5: contentId 5, type 'comment'
  {
    id: 7,
    userName: 'Grace',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 5,
    timestamp: [getHistoryTimeOffset(40, 11)], // 40일 전 11시
  },
  // 그룹 6: contentId 6, type 'commentLike'
  {
    id: 8,
    userName: 'Heidi',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 6,
    timestamp: [getHistoryTimeOffset(0, 13)], // 오늘 13시
  },
  {
    id: 9,
    userName: 'Ivan',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 6,
    timestamp: [getHistoryTimeOffset(0, 10)], // 오늘 10시
  },
  {
    id: 10,
    userName: 'Judy',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 6,
    timestamp: [getHistoryTimeOffset(3, 17)], // 3일 전 17시
  },
  {
    id: 11,
    userName: 'Alice',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 7,
    timestamp: [getHistoryTimeOffset(0, 10)], // 오늘 10시
  },
  {
    id: 12,
    userName: 'Bob',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 7,
    timestamp: [getHistoryTimeOffset(2, 9)], // 2일 전 9시
  },
  // 그룹 2: contentId 2, type 'comment'
  {
    id: 13,
    userName: 'Charlie',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 8,
    timestamp: [getHistoryTimeOffset(1, 12)], // 1일 전 12시
  },
  {
    id: 14,
    userName: 'David',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 9,
    timestamp: [getHistoryTimeOffset(6, 15)], // 6일 전 15시
  },
  // 그룹 3: contentId 3, type 'commentLike'
  {
    id: 15,
    userName: 'Eve',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 9,
    timestamp: [getHistoryTimeOffset(8, 16)], // 8일 전 16시
  },
  // 그룹 4: contentId 4, type 'like'
  {
    id: 16,
    userName: 'Frank',
    userProfile: ProfileImage,
    type: 'like',
    contentId: 9,
    timestamp: [getHistoryTimeOffset(20, 14)], // 20일 전 14시
  },
  // 그룹 5: contentId 5, type 'comment'
  {
    id: 17,
    userName: 'Grace',
    userProfile: ProfileImage,
    type: 'comment',
    contentId: 10,
    timestamp: [getHistoryTimeOffset(40, 11)], // 40일 전 11시
  },
  // 그룹 6: contentId 6, type 'commentLike'
  {
    id: 18,
    userName: 'Heidi',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 10,
    timestamp: [getHistoryTimeOffset(0, 13)], // 오늘 13시
  },
  {
    id: 19,
    userName: 'Ivan',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 10,
    timestamp: [getHistoryTimeOffset(0, 10)], // 오늘 10시
  },
  {
    id: 20,
    userName: 'Judy',
    userProfile: ProfileImage,
    type: 'commentLike',
    contentId: 10,
    timestamp: [getHistoryTimeOffset(3, 17)], // 3일 전 17시
  },
];

// timestamp를 Date 객체로 변환환
const convertToDate = (timestamp: HistoryTime): Date => {
  return new Date(
    timestamp.year,
    timestamp.month - 1,
    timestamp.date,
    timestamp.time
  );
};

// 동일한 contentId별로 알림 그룹화
const groupByContentId = (histories: History[]) => {
  return histories.reduce((acc: { [key: number]: History[] }, curr) => {
    const key = curr.contentId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});
};

// 중복되지 않는 사용자 추출출
const getDistinctUsers = (group: History[]): History[] => {
  // 가장 최근 알림 순으로 정렬
  const sorted = [...group].sort(
    (a, b) =>
      convertToDate(b.timestamp[0]).getTime() -
      convertToDate(a.timestamp[0]).getTime()
  );
  const distinct: History[] = [];
  const seen = new Set<string>();
  sorted.forEach((item) => {
    if (!seen.has(item.userName)) {
      seen.add(item.userName);
      distinct.push(item);
    }
  });
  return distinct;
};

const NotificationPage = () => {
  const now = new Date();
  const grouped = groupByContentId(mockHistory);
  const groupedNotifications = Object.keys(grouped).map((contentIdStr) => {
    const group = grouped[Number(contentIdStr)];
    // 최신순 정렬
    group.sort(
      (a, b) =>
        convertToDate(b.timestamp[0]).getTime() -
        convertToDate(a.timestamp[0]).getTime()
    );
    const mostRecent = group[0];
    const distinctUsers = getDistinctUsers(group);
    return {
      contentId: Number(contentIdStr),
      notifications: group,
      mostRecent,
      distinctUsers,
      type: mostRecent.type, // 같은 contentId 내 알림은 동일 type이라 가정
      timestamp: convertToDate(mostRecent.timestamp[0]),
    };
  });

  groupedNotifications.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const notificationsToday = groupedNotifications.filter((item) => {
    const d = item.timestamp;
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });
  const notificationsWeek = groupedNotifications.filter((item) => {
    const diffDays =
      (now.getTime() - item.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays < 7 && diffDays >= 1;
  });
  const notificationsMonth = groupedNotifications.filter((item) => {
    const diffDays =
      (now.getTime() - item.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays < 30 && diffDays >= 7;
  });
  const notificationsOld = groupedNotifications.filter((item) => {
    const diffDays =
      (now.getTime() - item.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 30;
  });

  /**
   * contentId 그룹별 렌더링 (id="what")
   */
  const renderNotificationGroup = (group: (typeof groupedNotifications)[0]) => {
    const { distinctUsers, type, contentId, mostRecent } = group;
    // 사용자 메시지 구성 (중복 제거된 순서에 따라)
    let userMessage = '';
    if (distinctUsers.length === 1) {
      userMessage = `${distinctUsers[0].userName}님이`;
    } else if (distinctUsers.length === 2) {
      userMessage = `${distinctUsers[0].userName}님과 ${distinctUsers[1].userName}님이`;
    } else {
      userMessage = `${distinctUsers[0].userName}님 외 ${
        distinctUsers.length - 1
      }명이`;
    }
    // type에 따른 액션 메시지 구성
    let actionText = '';
    if (type === 'like') {
      actionText = '당신의 게시글을 좋아합니다.';
    } else if (type === 'comment') {
      actionText = `${contentId}에 댓글을 달았습니다.`;
    } else if (type === 'commentLike') {
      actionText = '당신의 댓글을 좋아합니다.';
    }
    return (
      <div
        key={`${contentId}-${mostRecent.timestamp[0].time}`}
        id="what"
        className="flex items-center my-2 pt-2"
      >
        <img
          src={mostRecent.userProfile}
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <span className="text-s ml-2">
          {userMessage} {actionText}
        </span>
      </div>
    );
  };

  return (
    <div className="container-header bg-none">
      <Header left="back" text="Notification" isTitle={true} />
      <div
        id="background"
        className="w-full h-[calc(100vh-150px)] overflow-auto hide-scrollbar"
      >
        {notificationsToday.length > 0 && (
          <div id="today" className="m-5">
            <div className="font-bold pb-2">Today</div>
            {notificationsToday.map(renderNotificationGroup)}
          </div>
        )}
        {notificationsWeek.length > 0 && (
          <div id="week" className="m-5">
            <div className="font-bold pb-2">This Week</div>
            {notificationsWeek.map(renderNotificationGroup)}
          </div>
        )}
        {notificationsMonth.length > 0 && (
          <div id="month" className="m-5">
            <div className="font-bold pb-2">This Month</div>
            {notificationsMonth.map(renderNotificationGroup)}
          </div>
        )}
        {notificationsOld.length > 0 && (
          <div id="old" className="m-5">
            <div className="font-bold pb-2">Earlier</div>
            {notificationsOld.map(renderNotificationGroup)}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

//   return (
//     <div className="container-header bg-none">
//       <Header left="back" text="Notification" isTitle={true} />
//       <div id="background" className="w-full overflow-auto">
//         <div className="m-5">
//           <div id="today" className="font-bold pb-2">Today</div>
//           <div id="what">
//             <img
//               src={ProfileImage}
//               alt="profile img"
//               className="w-10 h-10 rounded-full"
//             />
//             <span className="text-s">{}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
