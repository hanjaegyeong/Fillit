import Header from '@/components/common/Header/Header';
import UserList from '@/components/Profile/UserList';
import { user } from '@/mocks/fixtures/user';

const FollowerPage = () => {
  return (
    <div className="container-header-nav overflow-hidden">
      <Header
        left="back"
        text={`${user[0].name}'s Followers`}
        right="notification"
      />
      <UserList type="followers" />
    </div>
  );
};

export default FollowerPage;
