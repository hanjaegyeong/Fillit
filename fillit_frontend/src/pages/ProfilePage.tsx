import Header from '@/components/common/Header';
import ProfileImage from '@/components/common/ProfileImage';
import { getPaperText } from '@/utils/getPaperText';
import { useState } from 'react';

const ProfilePage = () => {
  const [paperText, setPaperText] = useState<string>('');
  const [inputName, setInputName] = useState<string>('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setInputName(newName);

    // 입력된 텍스트로 paperText 업데이트
    getPaperText(newName).then((result) => {
      if (result) setPaperText(result);
    });
  };

  return (
    <div className="container-header-nav">
      <Header left="home" right="menu" />
      <div className="flex justify-center pt-20">
        <div className="flex flex-col items-center">
          <ProfileImage size={101} />
          {paperText && (
            <div className="-mt-16 ml-4">
              <img src={paperText} alt="Paper text" />
            </div>
          )}
          <div className="mt-20">
            <input
              type="text"
              value={inputName}
              onChange={handleNameChange}
              placeholder="Enter your name"
              maxLength={8}
              className="px-4 py-2 border-2 border-[#b5b4f2] rounded-lg focus:outline-none focus:border-[#596A95]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
