import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import SearchInput from '@/components/common/Input/SearchInput';
import ProfileImage from '@/mocks/images/profile-image.png';

interface UserList {
  id: number;
  image: string;
  user_name: string;
  user_id: string;
}

const mockUser: UserList[] = [
  {
    id: 1,
    image: ProfileImage,
    user_name: 'john_doe',
    user_id: '@john',
  },
  {
    id: 2,
    image: ProfileImage,
    user_name: 'alice_smith',
    user_id: '@alice',
  },
  {
    id: 3,
    image: ProfileImage,
    user_name: 'tech_guru',
    user_id: '@tech',
  },
  {
    id: 4,
    image: ProfileImage,
    user_name: 'john_doe',
    user_id: '@doe',
  },
  {
    id: 5,
    image: ProfileImage,
    user_name: 'alice_smith',
    user_id: '@smith',
  },
  {
    id: 6,
    image: ProfileImage,
    user_name: 'tech_guru',
    user_id: '@guru',
  },
  {
    id: 7,
    image: ProfileImage,
    user_name: 'tech_guru',
    user_id: '@tech',
  },
  {
    id: 8,
    image: ProfileImage,
    user_name: 'john_doe',
    user_id: '@doe',
  },
  {
    id: 9,
    image: ProfileImage,
    user_name: 'alice_smith',
    user_id: '@smith',
  },
  {
    id: 10,
    image: ProfileImage,
    user_name: 'tech_guru',
    user_id: '@guru',
  },
];

const NewMessagePage = () => {
  const [userResults, setUserResults] = useState(mockUser);
  const navigate = useNavigate();

  const handleSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    const filteredUsers = mockUser.filter(
      (user) =>
        user.user_name.toLowerCase().includes(searchTerm) ||
        user.user_id.toLowerCase().includes(searchTerm)
    );
    setUserResults(filteredUsers);
  };

  const handleUserClick = (chatId: number) => {
    navigate(`/message/${chatId}`);
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
        {userResults.map((chat) => (
          <div
            key={chat.id}
            className="p-4 bg-white flex "
            onClick={() => handleUserClick(chat.id)}
          >
            <img
              src={chat.image}
              alt={chat.user_id}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex flex-col justify-center">
              <p className="text-m font-bold text-gray-600">{chat.user_name}</p>
              <p className="text-xs text-gray-500">{chat.user_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewMessagePage;
