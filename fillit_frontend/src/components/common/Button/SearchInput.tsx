import { searchIcon } from '@/assets/assets';

interface SearchInputProps {
  className?: string;
}

const SearchInput = ({ className = '' }: SearchInputProps) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        placeholder="Search"
        className="w-[343px] px-4 py-1.5 text-sm bg-white rounded-full border-2 transition-colors duration-100 border-solid outline-none focus:border-[#b5b4f2] border-[#9a9a9a]"
      />
      <button className="absolute right-4">
        <img src={searchIcon} alt="search-icon" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SearchInput;
