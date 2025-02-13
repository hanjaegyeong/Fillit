import { getUserProfile } from '@/api/user';
import Header from '@/components/common/Header/Header';
import UserList from '@/components/Profile/UserList';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FollowerPage = () => {
  const { personalId } = useParams();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!personalId) return;
      try {
        const userData = await getUserProfile(personalId);
        setUserName(userData.name);
      } catch (error) {
        console.error('사용자 정보 조회 실패', error);
      }
    };
    fetchUserName();
  }, [personalId]);

  return (
    <div className="container-header-nav overflow-hidden">
      <Header
        left="back"
        text={`${userName}'s Followers`}
        right="notification"
      />
      <UserList type="followers" personalId={personalId} />
    </div>
  );
};

export default FollowerPage;
