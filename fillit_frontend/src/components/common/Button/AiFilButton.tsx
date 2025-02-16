import AiFilImg from '@/assets/images/ai-fil-img.png';
import AiFil from '@/assets/images/ai-fil.png';
import SlideUpModal from '@/components/common/Modal/SlideUpModal';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { postChatbot } from '@/api/chatbot';
import SubmitInput from '@/components/common/Input/SubmitInput';

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

const initialChatData = {
  chatId: 1,
  image: AiFilImg,
  userName: 'ai',
  messages: [
    {
      id: 1,
      sender: 'ai',
      content: "What's the problem?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ],
};

const AiFilButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const chatData = initialChatData;
  const [messages, setMessages] = useState<Message[]>(
    chatData ? chatData.messages : []
  );
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
  const sendMessage = async (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'me',
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const chatbotResponse = await postChatbot(newMessage.content);
      const aiMessage: Message = {
        id: messages.length + 2,
        sender: 'ai',
        content: chatbotResponse.message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('챗봇 API 호출 중 에러 발생:', error);
    }
  };
  const { pathname } = useLocation();

  return (
    <>
      <button
        className={
          pathname.includes('newarticle') || pathname.includes('edit')
            ? 'max-w-[600px] px-2 fixed bottom-[5.5rem]'
            : 'max-w-[600px] fixed bottom-[6.5rem] -ml-2'
        }
        onClick={() => setIsOpen(true)}
      >
        <img src={AiFilImg} alt="ai-fil-img" className="size-[4.5rem] " />
      </button>
      <SlideUpModal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex-grow overflow-y-auto pt-4 space-y-4 h-[calc(100vh-245px)] z-50 hide-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex items-end ${
                msg.sender === 'me' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender !== 'me' && isFirstMessage(index) && (
                <img
                  src={AiFil}
                  alt="ai-fil"
                  className="z-50 -mb-1 size-16 mr-1"
                />
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.sender === 'me'
                    ? 'bg-[#dcdada]/60 text-black font-light'
                    : 'bg-[#dcdada]/60 text-black font-light'
                }`}
              >
                <p className="font-extralight">{msg.content}</p>
                <span className="block text-xs text-gray-500 text-right mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="pt-3">
          <SubmitInput
            placeholder="Need help writing your thoughts?"
            onSubmit={sendMessage}
          />
        </div>
      </SlideUpModal>
    </>
  );
};

export default AiFilButton;
