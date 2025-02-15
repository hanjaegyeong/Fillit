import { FollowBackground } from '@/assets/assets';
import UserItem from '@/components/Profile/UserItem';
import SubmitInput from '@/components/common/Input/SubmitInput';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { getFollowerList, getFolloweeList } from '@/api/follow';
import LoadingSpinner from '../common/Loading/LoadingSpinner';
import { useUserStore } from '@/store/useUserStore';

interface UserListProps {
  type: 'followers' | 'following';
  personalId?: string;
}

const UserList = ({ type, personalId }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useUserStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!personalId) {
          console.error('personalId가 없습니다');
          return;
        }

        setIsLoading(true);

        const response =
          type === 'followers'
            ? await getFollowerList(personalId)
            : await getFolloweeList(personalId);

        // 현재 로그인한 사용자를 찾아 최상단으로
        const sortedUsers = [...response].sort((a, b) => {
          if (a.personalId === currentUser.personalId) return -1;
          if (b.personalId === currentUser.personalId) return 1;
          return 0;
        });

        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } catch (error) {
        console.error('[UserList] 사용자 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [type, personalId, currentUser.personalId]);

  const handleSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    const filtered = users.filter((userData) => {
      const name = userData.name ? userData.name.toLowerCase() : '';
      const personalId = userData.personalId
        ? userData.personalId.toLowerCase()
        : '';
      return name.includes(searchTerm) || personalId.includes(searchTerm);
    });
    setFilteredUsers(filtered);
  };

  useEffect(() => {}, [users]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="w-full p-4">
        <SubmitInput
          type="search"
          placeholder="Search"
          onSubmit={handleSearch}
        />
      </div>
      <div className="overflow-hidden grid h-full">
        <img
          src={FollowBackground}
          className="scale-[2.0] origin-top row-start-1 col-start-1"
          alt="follow background"
        />
        <div className="row-start-1 col-start-1 z-10 mt-[8rem] overflow-y-auto h-[calc(100vh-23rem)] hide-scrollbar">
          {filteredUsers.map((userData) => (
            <UserItem
              key={userData.personalId}
              userData={userData}
              type={type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
