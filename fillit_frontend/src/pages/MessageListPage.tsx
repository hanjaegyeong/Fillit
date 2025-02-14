import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import MockProfileImage from '@/mocks/images/profile-image.png';
import ProfileImage from '@/components/common/ProfileImage';
import { NewMessage } from '@/assets/assets';
import { truncateText } from '@/utils/truncateText';
import SubmitInput from '@/components/common/Input/SubmitInput';

interface ChatRoom {
  id: number;
  image: string;
  user_id: string;
  contents: string;
}

const mockChat: ChatRoom[] = [
  {
    id: 1,
    image: MockProfileImage,
    user_id: 'john_doe',
    contents: 'Hey! How have you been?',
  },
  {
    id: 2,
    image: MockProfileImage,
    user_id: 'alice_smith',
    contents: 'Did you see the latest movie?',
  },
  {
    id: 3,
    image: MockProfileImage,
    user_id: 'tech_guru',
    contents: 'Check out this cool new feature in React!',
  },
  {
    id: 4,
    image: MockProfileImage,
    user_id: 'tech_guru',
    contents: 'Check out this cool new feature in React!',
  },
  {
    id: 5,
    image: MockProfileImage,
    user_id: 'alice_smith',
    contents: 'Did you see the latest movie?',
  },
  {
    id: 6,
    image: MockProfileImage,
    user_id: 'tech_guru',
    contents: 'Check out this cool new feature in React!',
  },
  {
    id: 7,
    image: MockProfileImage,
    user_id: 'tech_guru',
    contents: 'Check out this cool new feature in React!',
  },
];

const MessageListPage = () => {
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
    <div className="container-header-nav">
      <Header left="home" right="notification" />

      <div className="py-7 px-4 w-full max-w-[22rem]">
        <SubmitInput
          type="search"
          placeholder="Search"
          onSubmit={handleSearch}
        />
      </div>

      <div className="w-full max-w-[22rem] px-4 overflow-y-auto max-h-[calc(100vh-250px)] hide-scrollbar space-y-3.5">
        {chatResults.map((chat) => (
          <div
            key={chat.id}
            className="px-3 py-4 bg-white rounded-[20px] shadow flex items-center cursor-pointer"
            onClick={() => handleChatClick(chat.id)}
          >
            <div className="mr-3">
              <ProfileImage src={chat.image} size={42} />
            </div>
            <div>
              <p className="text-sm font-medium">{chat.user_id}</p>
              <p className="text-sm font-extralight text-gray-600">
                {truncateText(chat.contents, 30)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full max-w-[600px] flex justify-end px-4 fixed bottom-28">
        <button
          onClick={() => navigate('/newmessage')}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md border border-[#D68DE1]"
        >
          <img
            src={NewMessage}
            alt="message-icon"
            className="w-10 h-10 object-contain pt-1"
          />
        </button>
      </div>
    </div>
  );
};

export default MessageListPage;
