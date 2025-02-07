import ArticleDetailContainer from '@/components/Article/ArticleDetailContainer';
import Header from '@/components/common/Header/Header';
import { useState } from 'react';
import ArticleDropDown from '@/components/common/ArticleDropdown';

const ArticleDetailPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleMenuClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="container-header-nav">
      <Header left="back" right="menu" onMenuClick={handleMenuClick} />
      <ArticleDropDown
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />
      <ArticleDetailContainer />
    </div>
  );
};

export default ArticleDetailPage;
