import AiFilImg from '@/assets/images/ai-fil-img.png';
import AiFil from '@/assets/images/ai-fil.png';
import SlideUpModal from '../Modal/SlideUpModal';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

export interface ChatData {
  chatId: number;
  image: string;
  userName: string;
  messages: Message[];
}

export const mockChatData: ChatData[] = [
  {
    chatId: 1,
    image: AiFilImg,
    userName: 'ai',
    messages: [
      {
        id: 1,
        sender: 'ai',
        content: "What's the problem?",
        timestamp: '10:00 AM',
      },
    ],
  },
];

const AiFilButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const chatId = 1;
  const chatData = mockChatData.find((chat) => chat.chatId === Number(chatId));
  const [messages, setMessages] = useState<Message[]>(
    chatData ? chatData.messages : []
  );
  const [inputMessage, setInputMessage] = useState('');
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
  const { pathname } = useLocation();

  return (
    <>
      <button
        className={
          pathname.includes('newarticle') || pathname.includes('edit')
            ? 'w-full max-w-[600px] px-4 fixed bottom-28'
            : 'fixed bottom-44'
        }
        onClick={() => setIsOpen(true)}
      >
        <img src={AiFilImg} alt="ai-fil-img" />
      </button>
      <SlideUpModal open={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-bold mb-4">AI Fil</h2>
        <div className="flex-grow overflow-y-auto p-4 space-y-4 h-[calc(100vh-340px)] z-50 hide-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex items-end ${
                msg.sender === 'me' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender !== 'me' && isFirstMessage(index) && (
                <img src={AiFil} alt="ai-fil" className="z-50" />
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'me'
                    ? 'bg-[#dcdada]/60 text-black font-light'
                    : 'bg-[#dcdada]/60 text-black font-light'
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
      </SlideUpModal>
    </>
  );
};
console.log('여기');
export default AiFilButton;
