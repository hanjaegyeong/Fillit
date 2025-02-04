import Header from '@/components/common/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ProfileImage from '@/mocks/images/profile-image.png';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatData {
  chatId: number;
  image: string;
  userName: string;
  messages: Message[];
}

const mockChatData: ChatData[] = [
  {
    chatId: 1,
    image: ProfileImage,
    userName: 'john_doe',
    messages: [
      {
        id: 1,
        sender: 'john_doe',
        content: 'Hey, how are you?',
        timestamp: '10:00 AM',
      },
      {
        id: 2,
        sender: 'me',
        content: 'I am good! How about you?',
        timestamp: '10:02 AM',
      },
      {
        id: 3,
        sender: 'john_doe',
        content: 'Hey, how are you?',
        timestamp: '10:00 AM',
      },
      {
        id: 4,
        sender: 'me',
        content: 'I am good! How about you?',
        timestamp: '10:02 AM',
      },
      {
        id: 5,
        sender: 'john_doe',
        content: 'Hey, how are you?',
        timestamp: '10:00 AM',
      },
      {
        id: 6,
        sender: 'me',
        content: 'I am good! How about you?',
        timestamp: '10:02 AM',
      },
      {
        id: 7,
        sender: 'john_doe',
        content: 'Hey, how are you?',
        timestamp: '10:00 AM',
      },
      {
        id: 8,
        sender: 'me',
        content: 'I am good! How about you?',
        timestamp: '10:02 AM',
      },
    ],
  },
  {
    chatId: 2,
    image: ProfileImage,
    userName: 'alice_smith',
    messages: [
      {
        id: 1,
        sender: 'alice_smith',
        content: 'Did you watch the movie?',
        timestamp: '11:00 AM',
      },
      {
        id: 2,
        sender: 'me',
        content: 'Yes! It was amazing!',
        timestamp: '11:05 AM',
      },
    ],
  },
];

const MessagePage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const chatData = mockChatData.find((chat) => chat.chatId === Number(chatId));
  const [messages, setMessages] = useState<Message[]>(
    chatData ? chatData.messages : []
  );
  const [inputMessage, setInputMessage] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 연속 메세지 확인
  const isFirstMessage = (index: number) => {
    if (index === 0) return true;
    return messages[index].sender !== messages[index - 1].sender;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메세지 전송
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'me',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage('');
  };

  return (
    <div className="container-header flex flex-col min-h-screen">
      <Header
        left="back"
        text={chatData ? chatData.userName : 'Chat'}
        isTitle={true}
      />
      <div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4 h-[calc(100vh-250px)] hide-scrollbar">
          {/* 프로필 */}
          <div className="flex flex-col items-center justify-start pt-8 pb-4">
            <img
              src={chatData?.image}
              alt={chatData?.userName}
              className="w-24 h-24 rounded-full"
            />
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg"
            >
              View Profile
            </button>
          </div>

          {/* 메세지 */}
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === 'me' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender !== 'me' && isFirstMessage(index) && (
                <img
                  src={chatData?.image}
                  alt={msg.sender}
                  onClick={() => navigate('/profile')}
                  className="w-8 h-8 rounded-full mr-2 self-end"
                />
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'me'
                    ? 'bg-white/60 text-black font-light'
                    : 'bg-white/60 text-black font-light'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="block text-xs text-gray-500 text-right mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 메세지 입력 */}
        <div className="p-6 flex items-center border-t border-gray-300">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow p-3 border rounded-lg focus:outline-none"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="ml-3 bg-blue-500 text-white p-3 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
