import { searchIcon, SendIcon } from '@/assets/assets';
import useInput from '@/hooks/useInput';
import { KeyboardEvent } from 'react';

interface SubmitInputProps {
  type?: 'send' | 'search';
  placeholder: string;
  maxLength?: number;
  onSubmit: (text: string) => void;
}

const SubmitInput = ({
  type = 'send',
  placeholder,
  maxLength = 100,
  onSubmit,
}: SubmitInputProps) => {
  const input = useInput('');

  const handleSubmit = () => {
    // 빈 문자열도 제출 -> 전체 목록 반환
    onSubmit(input.value);
    if (type === 'send' && input.value.trim()) {
      input.setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex-1 flex items-center">
      <input
        type="text"
        placeholder={placeholder}
        className={`py-2 pl-4 pr-11 min-w-16 w-full border-[0.06rem] border-black
        } rounded-full ${
          type === 'search' ? 'placeholder:text-base' : 'placeholder:text-sm'
        } placeholder:text-gray-400 placeholder:font-light focus:outline-none`}
        value={input.value}
        onChange={(e) => {
          input.setValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
      />
      <button onClick={handleSubmit} className="absolute right-4">
        <img
          src={type === 'send' ? SendIcon : searchIcon}
          alt="submit icon"
          className="h-[1.1rem] x-[1.1rem]"
        />
      </button>
    </div>
  );
};

export default SubmitInput;
