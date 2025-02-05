import { CameraIcon, IntroIcon, NameIcon } from '@/assets/assets';
import BasicInput from '@/components/common/Input/BasicInput';
import BasicButton from '@/components/common/Button/BasicButton';
import Header from '@/components/common/Header/Header';
import ProfileImage from '@/components/common/ProfileImage';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    navigate('/profile');
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="container-header ">
      <Header left="back" />
      <div className="flex flex-col items-center">
        <div className="mt-16 flex flex-col items-center">
          <ProfileImage src={profileImage} size={101} />
          <button
            onClick={handleCameraClick}
            className="w-10 h-10 bg-white rounded-[1.3rem] shadow-[5px_6px_18px_#00000014] -mt-8 ml-20"
          >
            <img src={CameraIcon} alt="camera" className="scale-125 ml-2.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
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

export default ProfileEditPage;
