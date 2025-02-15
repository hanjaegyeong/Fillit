import { FollowBackground } from '@/assets/assets';
import UserItem from '@/components/Profile/UserItem';
import SubmitInput from '@/components/common/Input/SubmitInput';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { getFollowerList, getFolloweeList } from '@/api/follow';
import LoadingOverlay from '@/components/common/Loading/LoadingOverlay';
import { useUserStore } from '@/store/useUserStore';
import { useQuery } from '@tanstack/react-query';

interface UserListProps {
  type: 'followers' | 'following';
  personalId?: string;
}

const UserList = ({ type, personalId }: UserListProps) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
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

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  const handleSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    const filtered = users?.filter((userData) => {
      const name = userData.name ? userData.name.toLowerCase() : '';
      const personalId = userData.personalId
        ? userData.personalId.toLowerCase()
        : '';
      return name.includes(searchTerm) || personalId.includes(searchTerm);
    });
    setFilteredUsers(filtered || []);
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
