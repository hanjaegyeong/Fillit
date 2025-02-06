import Header from '@/components/common/Header/Header';
import { mockHistory } from '@/mocks/notification';
import { History } from '@/types/notification';
import { HistoryTime } from '@/types/notification';

// timestamp를 Date 객체로 변환
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

  // contentId 그룹별 렌더링
  const renderNotificationGroup = (group: (typeof groupedNotifications)[0]) => {
    const { distinctUsers, type, contentId, mostRecent } = group;

    // 사용자 메시지 구성 (중복 제거된 순서에 따라)
    const renderUserMessage = () => {
      if (distinctUsers.length === 1) {
        return (
          <>
            <span className="font-bold">{distinctUsers[0].userName}</span>
          </>
        );
      } else if (distinctUsers.length === 2) {
        return (
          <>
            <span className="font-bold">{distinctUsers[0].userName}</span> and{' '}
            <span className="font-bold">{distinctUsers[1].userName}</span>
          </>
        );
      } else {
        return (
          <>
            <span className="font-bold">{distinctUsers[0].userName}</span> and{' '}
            <span className="font-bold">{distinctUsers.length - 1}</span> others
          </>
        );
      }
    };

    const renderActionText = () => {
      if (type === 'like') {
        return <>liked your contents.</>;
      } else if (type === 'comment') {
        return (
          <>
            commented on <span className="font-bold">{contentId}</span>.
          </>
        );
      } else if (type === 'commentLike') {
        return <>liked your comment.</>;
      } else if (type === 'follow') {
        return <>started following you.</>;
      }
      return null;
    };

    // 라우팅 경로
    // follow: userId 기반 프로필 페이지 (/mynameis)
    // 그 외: contentId 기반 게시글 페이지 (/article/0, 임시 경로)
    const destination =
      type === 'follow'
        ? `profile/mynameis`
        : `/article/0?contentId=${contentId}`;

    return (
      <a
        key={`${contentId}-${mostRecent.timestamp[0].time}`}
        href={destination}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div id="what" className="flex items-center my-2 cursor-pointer pb-2 ">
          <img
            src={mostRecent.userProfile}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-s ml-2">
            {renderUserMessage()} {renderActionText()}
          </span>
        </div>
      </a>
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
