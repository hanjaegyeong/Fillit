import SearchArticleListContainer from '@/components/Article/SearchArticleListContainer';
import Header from '@/components/common/Header/Header';
import { useState } from 'react';

const SearchPage = () => {
  const [searchWord, setSearchWord] = useState('');

  const handleSearchInput = (word: string) => {
    setSearchWord(word);
  };

  return (
    <div className="container-header-nav">
      <Header center="search" onSubmit={handleSearchInput} />
      <SearchArticleListContainer word={searchWord} />
    </div>
  );
};

export default SearchPage;
