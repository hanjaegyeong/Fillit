import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import loginImg from '@/assets/images/login-img.png';
import BasicInput from '@/components/common/Input/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';
import SocialLogin from '@/components/common/SocialLogin';
import { postLogin } from '@/api/login';

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await postLogin(email, password);
      navigate('/');
    } catch (error) {
      alert('등록된 이메일이 아니거나 비밀번호가 다릅니다.');
    }
  };

  return (
    <div className="container-base gap-2 justify-center">
      <img src={loginImg} alt="login-img" />

      <BasicInput
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <BasicInput
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="w-[280px] flex justify-end">
        <button
          className="text-xs font-light"
          onClick={() => navigate('/signup')}
        >
          Sign up
        </button>
      </div>
      <BasicButton onClick={handleLogin} />
      <button className="text-xs font-light" onClick={() => navigate('/find')}>
        Find Password
      </button>
      <SocialLogin />
    </div>
  );
};

export default LoginPage;
