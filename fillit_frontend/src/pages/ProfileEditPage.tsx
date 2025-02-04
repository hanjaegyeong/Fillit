import { CameraIcon, IntroIcon, NameIcon } from '@/assets/assets';
import BasicInput from '@/components/common/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';
import Header from '@/components/common/Header';
import ProfileImage from '@/components/common/ProfileImage';
import { useNavigate } from 'react-router-dom';

export const ProfileEditPage = () => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/profile');
  };

  const handleCameraClick = () => {
    console.log('프로필 이미지 업로드');
  };

  return (
    <div className="container-header ">
      <Header left="back" />
      <div className="flex flex-col items-center">
        <div className="mt-16 flex flex-col items-center">
          <ProfileImage size={101} />
          <button
            onClick={handleCameraClick}
            className="w-10 h-10 bg-white rounded-[1.3rem] shadow-[5px_6px_18px_#00000014] -mt-8 ml-20"
          >
            <img src={CameraIcon} alt="camera" className="scale-125 ml-2.5" />
          </button>
        </div>
        <div>
          <div className="flex mt-5 ">
            <img src={NameIcon} alt="name" />
            <p className="font-light ml-1">name</p>
          </div>
          <BasicInput />
          <div className="flex mt-5">
            <img src={IntroIcon} alt="intro" />
            <p className="font-light ml-1.5">introduction</p>
          </div>
          <BasicInput height={100} placeholder="Introduce yourself!" />
        </div>
        <div className="mt-10">
          <BasicButton text="Edit" onClick={handleEditClick} width="6rem" />
        </div>
      </div>
    </div>
  );
};
