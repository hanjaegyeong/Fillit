import FilTakeOn from '@/assets/images/fil-takeon.png';
import BasicButton from '@/components/common/Button/BasicButton';
import SignupMessages from '@/components/Signup/StepMessages';
import useTypingEffect from '@/hooks/useTypingEffect';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const messages = ['Oops! Page not found.', 'Try again!'];

  const typedMessages = useTypingEffect(messages, 0, 30);

  const handleClick = () => {
    navigate('/');
  };
  return (
    <div className="bg-home h-screen flex flex-col items-center justify-center">
      {' '}
      <img src={FilTakeOn} alt="fil-takeon-img" className="w-44" />
      <SignupMessages messages={messages} typedMessages={typedMessages} />
      <div className="pt-3">
        <BasicButton text="Go Home" onClick={handleClick} width="125px" />
      </div>
    </div>
  );
};

export default NotFoundPage;
