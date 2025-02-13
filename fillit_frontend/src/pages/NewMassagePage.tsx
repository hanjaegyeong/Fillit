import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import SearchInput from '@/components/common/Input/SearchInput';
import ProfileImage from '@/mocks/images/profile-image.png';
import { postRoom } from '@/api/message';
import UserList from '@/components/Profile/UserList';

interface UserList {
  id: number;
  image: string;
  user_name: string;
  personalId: string;
}

const mockUser: UserList[] = [
  {
    id: 1,
    image: ProfileImage,
    user_name: 'hanbh',
    personalId: 'qudgus0117',
  },
];

const NewMessagePage = () => {
  const [userResults, setUserResults] = useState<UserList[]>(mockUser);
  const navigate = useNavigate();

  const handleSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    const filteredUsers = mockUser.filter(
      (user) =>
        user.user_name.toLowerCase().includes(searchTerm) ||
        user.personalId.toLowerCase().includes(searchTerm)
    );
    setUserResults(filteredUsers);
  };

  const handleUserClick = async (user: UserList) => {
    try {
      // API 호출: 선택한 유저의 user_id를 otherPersonalId로 사용하여 채팅방 생성
      const newRoom = await postRoom(user.personalId);
      console.log(newRoom);
      // 생성된 채팅방으로 이동
      navigate(`/message/${newRoom.chatRoomId}`);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  return (
    <div className="container-header bg-none">
      <Header left="back" text="New Message" isTitle={true} />
      <div className="p-4 flex flex-col justify-center items-center">
        <SearchInput
          className=""
          onSearch={handleSearch}
          placeholder="search"
          width="w-[300px]"
        />
      </div>
      <div className="w-full px-4 overflow-y-auto max-h-[calc(100vh-220px)] hide-scrollbar">
        {userResults.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white flex "
            onClick={() => handleUserClick(user)}
          >
            <img
              src={user.image}
              alt={user.personalId}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex flex-col justify-center">
              <p className="text-m font-bold text-gray-600">{user.user_name}</p>
              <p className="text-xs text-gray-500">{user.personalId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewMessagePage;
