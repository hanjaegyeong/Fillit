import loginImg from '@/assets/images/login-img.png';
import BasicInput from '@/components/common/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';
import SocialLogin from '@/components/common/SocialLogin';

const Login = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen">
      <img src={loginImg} alt="login-img" />
      <BasicInput placeholder="Enter your email" />
      <BasicInput placeholder="Enter your password" />
      <div className="w-[280px] flex justify-end">
        <a className="text-xs font-light" href="/SignUp">
          sign up
        </a>
      </div>
      <BasicButton />
      <a className="text-xs font-light" href="/Find">
        Find ID / Password
      </a>
      <SocialLogin />
    </div>
  );
};

export default Login;
