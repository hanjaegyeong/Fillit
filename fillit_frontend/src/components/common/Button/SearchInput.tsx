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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className={`${width} px-4 py-2 text-sm bg-white rounded-full border transition-colors duration-100 outline-none focus:border-[#b5b4f2] border-[#9a9a9a]`}
        />
        <button type="submit" className="absolute right-4">
          <img src={searchIcon} alt="search-icon" className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
