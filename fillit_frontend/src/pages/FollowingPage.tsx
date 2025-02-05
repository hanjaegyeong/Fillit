import Header from '@/components/common/Header/Header';
import FollowingList from '@/components/Profile/FollowingList';
import { user } from '@/mocks/fixtures/user';

const FollowingPage = () => {
  return (
    <div className="container-header-nav">
      <Header
        left="back"
        text={`People ${user.name} keeps up with ⭐`}
        right="notification"
      />
      <FollowingList />
    </div>
  );
};

export default FollowingPage;
