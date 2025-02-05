import { searchIcon } from '@/assets/assets';
import { useState } from 'react';

interface SearchInputProps {
  className?: string;
  onSearch: (term: string) => void;
  placeholder?: string;
  width?: string;
}

const SearchInput = ({
  className = '',
  onSearch,
  placeholder = 'Search',
  width = 'w-[343px]',
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onSearch(newValue);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`flex items-center ${className}`}
    >
      <div className={`relative flex items-center ${width}`}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 text-sm bg-white rounded-full border transition-colors duration-100 border-solid outline-none focus:border-[#b5b4f2] border-[#9a9a9a]"
          style={{ textIndent: '0px', paddingRight: '40px' }}
        />
        <span className="absolute right-4">
          <img src={searchIcon} alt="search-icon" className="w-4 h-4" />
        </span>
      </div>
    </form>
  );
};

export default SearchInput;
