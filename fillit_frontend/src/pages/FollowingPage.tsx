import { getFolloweeList } from '@/api/follow';
import { getUserProfile } from '@/api/user';
import Header from '@/components/common/Header/Header';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';
import UserList from '@/components/Profile/UserList';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FollowingPage = () => {
  const { personalId } = useParams();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!personalId) return;
        setIsLoading(true);

        // 1. 유저 기본 정보 조회
        const userData = await getUserProfile(personalId);
        setUserName(userData.name);

        // 2. 해당 유저가 팔로우하는 사람들의 목록 조회
        const followeeData = await getFolloweeList(personalId);
        console.log('팔로잉 목록:', followeeData); // 디버깅용
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [personalId]);

  if (!personalId) return null;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container-header-nav overflow-hidden">
      <Header
        left="back"
        text={`${userName}'s Following`}
        right="notification"
      />
      <UserList type="following" personalId={personalId} />
    </div>
  );
};

export default FollowingPage;
