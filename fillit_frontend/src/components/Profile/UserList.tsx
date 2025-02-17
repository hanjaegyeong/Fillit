import { FollowBackground } from '@/assets/assets';
import UserItem from '@/components/Profile/UserItem';
import SubmitInput from '@/components/common/Input/SubmitInput';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import {
  getFollowerList,
  getFolloweeList,
  getFollowerSearch,
  getFolloweeSearch,
} from '@/api/follow';
import LoadingOverlay from '@/components/common/Loading/LoadingOverlay';
import { useUserStore } from '@/store/useUserStore';
import { useQuery } from '@tanstack/react-query';

interface UserListProps {
  type: 'followers' | 'following';
  personalId?: string;
}

const UserList = ({ type, personalId }: UserListProps) => {
  // const [searchTerm, setSearchTerm] = useState<string>('');
  const { user: currentUser } = useUserStore();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', type, personalId],
    queryFn: async () => {
      if (!personalId) {
        throw new Error('persoanlId가 없습니다');
      }
      const response =
        type === 'followers'
          ? await getFollowerList(personalId)
          : await getFolloweeList(personalId);

      return [...response].sort((a, b) => {
        if (a.personalId === currentUser.personalId) return -1;
        if (b.personalId === currentUser.personalId) return 1;
        return 0;
      });
    },
    enabled: !!personalId,
  });

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  // 실시간 검색 처리
  const handleSearch = async (term: string) => {
    // setSearchTerm(term);
    if (!personalId) return;
    try {
      // 검색어가 비어있으면 전체 목록 표시
      if (!term || term.trim() === '') {
        setFilteredUsers(users || []);
        return;
      }

      const response =
        type === 'followers'
          ? await getFollowerSearch(personalId, term)
          : await getFolloweeSearch(personalId, term);

      // 검색 결과에 기존 users의 follow 상태를 유지
      const updatedResponse = response.map((searchUser: User) => {
        const existingUser = users?.find(
          (user) => user.personalId === searchUser.personalId
        );
        return {
          ...searchUser,
          follow: existingUser?.follow ?? searchUser.follow,
        };
      });
      setFilteredUsers(updatedResponse);
    } catch (error) {
      console.error('팔로워/팔로잉 검색 실패:', error);
      setFilteredUsers([]); // 에러 발생 시 빈 배열
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      <div className="w-full p-4 pt-6">
        <SubmitInput
          type="search"
          placeholder="Search"
          onSubmit={handleSearch}
        />
      </div>
      <div className="overflow-hidden grid h-full">
        <img
          src={FollowBackground}
          className="scale-[1.7] origin-top row-start-1 col-start-1"
          alt="follow background"
        />
        <div className="row-start-1 col-start-1 z-10 mt-[6rem] overflow-y-auto h-[calc(100vh-23rem)] hide-scrollbar">
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
