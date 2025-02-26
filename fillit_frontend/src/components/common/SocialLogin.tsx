import { GoogleIcon, KakaoIcon, NaverIcon } from '@/assets/assets';
import SocialLoginItem from './SocialLoginItem';

// 이후 소셜 로그인 경로 연결 필요
const SocialLoginItems = [
  {
    socialId: 'google',
    icon: GoogleIcon,
    alt: 'google icon',
    to: '/socialsignup',
  },
  {
    socialId: 'kakao',
    icon: KakaoIcon,
    alt: 'kakao icon',
    to: '/socialsignup',
  },
  {
    socialId: 'naver',
    icon: NaverIcon,
    alt: 'naver icon',
    to: '/socialsignup',
  },
];

const SocialLogin = () => {
  return (
    <>
      <div className="flex flex-row gap-3 pt-6">
        {SocialLoginItems.map((item) => (
          <SocialLoginItem
            key={item.socialId}
            icon={item.icon}
            alt={item.alt}
            to={item.to}
          />
        ))}
      </div>
    </>
  );
};

export default SocialLogin;
