import { FollowBackground } from '@/assets/assets';
import UserItem from '@/components/Profile/UserItem';
import { useState } from 'react';
import { user } from '@/mocks/fixtures/user';
import SubmitInput from '@/components/common/Input/SubmitInput';

interface UserListProps {
  type: 'followers' | 'following';
}

const UserList = ({ type }: UserListProps) => {
  const [filteredUsers, setFilteredUsers] = useState(user);

  const handleSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    const filtered = user.filter(
      (userData) =>
        userData.name.toLowerCase().includes(searchTerm) ||
        userData.personalId.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

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
            <UserItem key={userData.id} userData={userData} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
