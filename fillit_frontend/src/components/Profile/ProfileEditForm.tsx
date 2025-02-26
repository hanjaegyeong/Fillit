import React, { ChangeEvent, useState } from 'react';
import BasicInput from '@/components/common/Input/BasicInput';
import { NameIcon, IntroIcon, HeartIcon } from '@/assets/assets';
import { CategoryModal } from '@/components/common/Modal/CategoryModal';
import { INTEREST_TAGS } from '@/constants/interestTags';
import useInput from '@/hooks/useInput';

interface ProfileEditFormProps {
  name: string;
  introduction: string;
  interests: string[];
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onIntroductionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInterestsChange: (interests: string[]) => void;
  errors: { [key: string]: string };
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  name,
  introduction,
  interests,
  onNameChange,
  onIntroductionChange,
  onInterestsChange,
  errors,
}) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { onChange: handleIntroChange, onKeyDown } = useInput(introduction);

  const handleIntroductionChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleIntroChange(e);
    onIntroductionChange(e);
  };

  const handleInterestSelect = (selectedTags: string[]) => {
    onInterestsChange(selectedTags);
    setIsCategoryModalOpen(false);
  };

  return (
    <div className="flex flex-col">
      {/* Name */}
      <div className="flex mt-5 px-1">
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

      {/* Introduction */}
      <div className="flex mt-5 px-1">
        <img src={IntroIcon} alt="intro" />
        <p className="font-light ml-1.5">introduction</p>
      </div>
      <BasicInput
        height={100}
        placeholder="Introduce yourself!"
        value={introduction}
        onChange={handleIntroductionChange}
        onKeyDown={onKeyDown}
      />

      {/* Interests */}
      <div className="flex mt-5 px-1 items-center">
        <img src={HeartIcon} alt="heart" />
        <p className="font-light ml-1.5">interests</p>
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="ml-2 px-2 text-sm rounded-lg border-[#5e72e4] border-2 bg-[#5e72e4] text-white hover:bg-[#8187aa]"
        >
          Select
        </button>
      </div>

      {/* Interest tags container */}
      <div className="mt-2 w-full">
        <div className="grid grid-cols-2 gap-1">
          {interests.map((interest) => {
            const tagData = INTEREST_TAGS.find((tag) => tag.label === interest);
            return (
              <div key={interest}>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-white to-white/80 rounded-full text-sm">
                  {tagData?.icon && (
                    <img
                      src={tagData.icon}
                      alt={interest}
                      className="w-4 h-4"
                    />
                  )}
                  <span>{interest}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelect={handleInterestSelect}
        selectedCategory={interests}
      />
    </div>
  );
};

export default React.memo(ProfileEditForm);
