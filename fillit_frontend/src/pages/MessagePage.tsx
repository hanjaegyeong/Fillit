import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import SearchInput from '@/components/common/Button/SearchInput';
import ProfileImage from '@/mocks/images/profile-image.png';
import { NewMessage } from '@/assets/assets';

interface ChatRoom {
  id: number;
  image: string;
  user_id: string;
  contents: string;
}

const mockChat: ChatRoom[] = [
  {
    id: 1,
    image: ProfileImage,
    user_id: 'john_doe',
    contents: 'Hey! How have you been?',
  },
  {
    id: 2,
    image: ProfileImage,
    user_id: 'alice_smith',
    contents: 'Did you see the latest movie?',
  },
  {
    id: 3,
    image: ProfileImage,
    user_id: 'tech_guru',
    contents: 'Check out this cool new feature in React!',
  },
];

const MessagePage = () => {
  const [chatResults, setChatResults] = useState(mockChat);

  const handleSearch = (term: string) => {
    const searchTerm = term.toLowerCase().trim();
    const filteredChats = mockChat.filter((chat) =>
      chat.user_id.toLowerCase().includes(searchTerm)
    );
    setChatResults(filteredChats);
  };

  const handleChatClick = (chatId: number) => {
    navigate(`/message/${chatId}`);
  };

  const navigate = useNavigate();

  return (
    <>
      <Header left="home" right="notification" />
      <div className="mt-6 space-y-5 p-5">
        <div className="flex flex-col justify-center items-center">
          <SearchInput
            className=""
            onSearch={handleSearch}
            placeholder="search"
            width="w-[300px]"
          />
        </div>
        <div className="fixed bottom-28 right-4 z-50">
          <button
            onClick={() => navigate('/newmessage')}
            className="w-[64px] h-[64px] bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <img
              src={NewMessage}
              alt="mic-back"
              className="w-full h-full object-contain"
            />
          </button>
        </div>
        {chatResults.map((chat) => (
          <div
            key={chat.id}
            className="p-4 bg-white rounded-lg shadow flex items-center"
            onClick={() => handleChatClick(chat.id)}
          >
            <img
              src={chat.image}
              alt={chat.user_id}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="text-sm font-bold text-gray-600">{chat.user_id}</p>
              <p className="text-sm text-gray-500">{chat.contents}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MessagePage;

