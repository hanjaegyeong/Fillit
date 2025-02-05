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
  content: string;
  timestamp: HistoryTime[];
}

const mockHistory: History[] = [
  {
    id: 1,
    userName: 'A',
    userProfile: ProfileImage,
    content: 'like',
    timestamp: [{ time: 10, date: 12, month: 1, year: 2024 }],
  },
  {
    id: 2,
    userName: 'B',
    userProfile: ProfileImage,
    content: 'comment',
    timestamp: [{ time: 14, date: 12, month: 1, year: 2024 }],
  },
  {
    id: 3,
    userName: 'C',
    userProfile: ProfileImage,
    content: 'like',
    timestamp: [{ time: 10, date: 15, month: 1, year: 2024 }],
  },
  {
    id: 4,
    userName: 'A',
    userProfile: ProfileImage,
    content: 'comment',
    timestamp: [{ time: 10, date: 12, month: 2, year: 2024 }],
  },
  {
    id: 5,
    userName: 'C',
    userProfile: ProfileImage,
    content: 'like',
    timestamp: [{ time: 10, date: 12, month: 2, year: 2024 }],
  },
];

const NotificationPage = () => {
  return (
    <div className="container-header bg-none">
      <Header left="back" text="Notification" isTitle={true} />
      <div id="background" className="w-full overflow-auto">
        <div className="m-5">
          <div className="font-bold">Today</div>
          <div>hi</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
