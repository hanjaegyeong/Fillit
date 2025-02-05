import Header from '@/components/common/Header/Header';
import UserList from '@/components/Profile/UserList';
import { user } from '@/mocks/fixtures/user';

const FollowingPage = () => {
  return (
    <div className="container-header-nav">
      <Header
        left="back"
        text={`${user[0].name}'s Following`}
        right="notification"
      />
      <UserList type="following" />
    </div>
  );
};

export default FollowingPage;
