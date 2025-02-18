import Header from '@/components/common/Header/Header';
import NotificationContainer from '@/components/Notification/NotificationContainer';

const NotificationPage = () => {
  return (
    <div className="container-header-nav bg-none">
      <Header left="back" text="Notification" isTitle={true} />
      <NotificationContainer />
    </div>
  );
};

export default NotificationPage;
