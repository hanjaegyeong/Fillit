import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import SearchInput from '@/components/common/Button/SearchInput';
import ProfileImage from '@/mocks/images/profile-image.png';

interface UserList {
  id: number;
  image: string;
  user_id: string;
}

const mockUser: UserList[] = [
  {
    id: 1,
    image: ProfileImage,
    user_id: 'john_doe',
  },
  {
    id: 2,
    image: ProfileImage,
    user_id: 'alice_smith',
  },
  {
    id: 3,
    image: ProfileImage,
    user_id: 'tech_guru',
  },
];

const NewMessagePage = () => {
  const [userResults, setUserResults] = useState(mockUser);
  const navigate = useNavigate();

  const handleSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    const filteredUsers = mockUser.filter((user) =>
      user.user_id.toLowerCase().includes(searchTerm)
    );
    setUserResults(filteredUsers);
  };

  const handleUserClick = (chatId: number) => {
    navigate(`/message/${chatId}`);
  };
  return (
    <div className="bg-white h-screen">
      <Header left="back" text="New Message" isTitle={true} />
      <div className="flex flex-col justify-center items-center">
        <SearchInput
          className=""
          onSearch={handleSearch}
          placeholder="search"
          width="w-[300px]"
        />
      </div>
      {userResults.map((chat) => (
        <div
          key={chat.id}
          className="p-4 bg-white rounded-lg shadow flex items-center"
          onClick={() => handleUserClick(chat.id)}
        >
          <img
            src={chat.image}
            alt={chat.user_id}
            className="w-12 h-12 rounded-full mr-4"
          />
        </div>
      ))}
    </div>
  );
};

export default NewMessagePage;
