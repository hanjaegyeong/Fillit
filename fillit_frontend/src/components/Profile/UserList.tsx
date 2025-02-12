import { FollowBackground } from '@/assets/assets';
import UserItem from '@/components/Profile/UserItem';
import SearchInput from '@/components/common/Input/SearchInput';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { getFollowerList, getFolloweeList } from '@/api/follow';
import LoadingSpinner from '../common/Loading/LoadingSpinner';

interface UserListProps {
  type: 'followers' | 'following';
  personalId?: string;
}

const UserList = ({ type, personalId }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!personalId) {
          console.error('personalId가 없습니다');
          return;
        }

        setIsLoading(true);
        console.log('API 호출 파라미터:', { type, personalId });

        const response =
          type === 'followers'
            ? await getFollowerList(personalId)
            : await getFolloweeList(personalId);

        console.log('API 응답:', response);

        setUsers(response);
        setFilteredUsers(response);
      } catch (error) {
        console.error('사용자 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [type, personalId]);

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

  useEffect(() => {
    console.log('userData:', users);
  }, [users]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex justify-center w-full px-4">
        <SearchInput
          className="mt-[2.5rem]"
          onSearch={handleSearch}
          placeholder="search"
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
            <UserItem key={userData.id} userData={userData} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
