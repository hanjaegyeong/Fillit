import Header from '@/components/common/Header/Header';
import FollowerList from '@/components/Profile/FollowerList';
import { user } from '@/mocks/fixtures/user';

const FollowerPage = () => {
  return (
    <div className="container-header-nav">
      <Header
        left="back"
        text={`${user.name}'s friends & followers 💫`}
        right="notification"
      />
      <FollowerList />
    </div>
  );
};

export default FollowerPage;
