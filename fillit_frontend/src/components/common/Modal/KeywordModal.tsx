import { Keyword } from '@/assets/assets';
import Modal from './Modal';
import BasicButton from '../Button/BasicButton';
import { useState, useEffect } from 'react';

interface KeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (keyword: string) => void;
  initialKeyword?: string;
}

export const KeywordModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialKeyword = '',
}: KeywordModalProps) => {
  const [inputValue, setInputValue] = useState(initialKeyword);
  const isValidKeyWord = inputValue.length >= 1 && inputValue.length <= 8;

  useEffect(() => {
    setInputValue(initialKeyword);
  }, [initialKeyword]);

  const handleClose = () => {
    setInputValue('');
    onClose();
  };

  const handleKeywordConfirm = () => {
    console.log('Selected keyword:', inputValue);
    onConfirm(inputValue);
    onClose();
    setInputValue('');
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="big">
      <div className="m-10">
        <div className="flex justify-center items-center pt-12 ">
          <img src={Keyword} alt="keyword" />
        </div>
        <p className="text-xl font-light text-center pt-3">
          These keywords
          <br />
          are only used
          <br />
          when customizing
          <br />
          your profile.
        </p>
        <div className="flex justify-center items-center pt-6">
          <input
            placeholder="Enter your keywords"
            className="bg-[#ffffff] px-3 py-1.5 w-[200px] text-[#757575] text-lg rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#b5b4f2] outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            maxLength={8}
          />
        </div>
        <div className="flex justify-center items-center pt-10 gap-4">
          <BasicButton text="Cancel" onClick={handleClose} />
          <BasicButton
            text="Confirm"
            onClick={handleKeywordConfirm}
            disabled={!isValidKeyWord}
          />
        </div>
      </div>
    </Modal>
  );
};
