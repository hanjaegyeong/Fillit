import { useNavigate } from 'react-router-dom';

import loginImg from '@/assets/images/login-img.png';
import BasicInput from '@/components/common/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';
import SocialLogin from '@/components/common/SocialLogin';

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen">
      <img src={loginImg} alt="login-img" />
      <BasicInput placeholder="Enter your email" />
      <BasicInput placeholder="Enter your password" />
      <div className="w-[280px] flex justify-end">
        <button
          className="text-xs font-light"
          onClick={() => navigate('/signup')}
        >
          Sign up
        </button>
      </div>
      <BasicButton />
      <button className="text-xs font-light" onClick={() => navigate('/find')}>
        Find Password
      </button>
      <SocialLogin />
    </div>
  );
};

export default LoginPage;
