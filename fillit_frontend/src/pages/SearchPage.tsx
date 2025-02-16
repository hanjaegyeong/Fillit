import SearchArticleListContainer from '@/components/Article/SearchArticleListContainer';
import Header from '@/components/common/Header/Header';

const SearchPage = () => {
  return (
    <div className="container-header-nav">
      <Header center="search" />
      <SearchArticleListContainer />
    </div>
  );
};

export default SearchPage;
