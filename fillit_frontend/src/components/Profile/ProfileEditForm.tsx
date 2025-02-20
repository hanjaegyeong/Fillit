{
  /*프로필 수정 입력 폼*/
}

import React, { ChangeEvent } from 'react';
import BasicInput from '@/components/common/Input/BasicInput';
import { NameIcon, IntroIcon } from '@/assets/assets';

interface ProfileEditFormProps {
  name: string;
  introduction: string;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onIntroductionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  name,
  introduction,
  onNameChange,
  onIntroductionChange,
  errors,
}) => {
  return (
    <div>
      <div className="flex mt-5">
        <img src={NameIcon} alt="name" />
        <p className="font-light ml-1">name</p>
      </div>
      <BasicInput
        placeholder="Enter your name"
        value={name}
        onChange={onNameChange}
        className={errors.name ? 'border-red-500' : ''}
      />
      {errors.name && (
        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
      )}
      <div className="flex mt-5">
        <img src={IntroIcon} alt="intro" />
        <p className="font-light ml-1.5">introduction</p>
      </div>
      <BasicInput
        height={100}
        placeholder="Introduce yourself!"
        value={introduction}
        onChange={onIntroductionChange}
      />
    </div>
  );
};

export default React.memo(ProfileEditForm);
