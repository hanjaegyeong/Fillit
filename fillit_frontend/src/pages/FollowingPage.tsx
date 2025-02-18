import Header from '@/components/common/Header/Header';
import UserList from '@/components/Profile/UserList';
import { useGetProfile } from '@/hooks/query/useGetProfile';
import { useParams } from 'react-router-dom';

const FollowingPage = () => {
  const { personalId } = useParams();
  const { data: userData, isLoading } = useGetProfile(personalId ?? '');

  return (
    <div className="container-header-nav overflow-hidden">
      <Header
        left="back"
        text={
          isLoading ? 'Loading...' : `${userData?.name}'s who they vibe with`
        }
        right="notification"
      />
      <UserList type="following" personalId={personalId} />
    </div>
  );
};

export default FollowingPage;
