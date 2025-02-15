import ArticleDetailContainer from '@/components/Article/ArticleDetailContainer';
import Header from '@/components/common/Header/Header';
import { useState } from 'react';
import ArticleDropDown from '@/components/common/ArticleDropdown';
import { useParams } from 'react-router-dom';
import useGetArticle from '@/hooks/query/useGetArticle';
import { useUserStore } from '@/store/useUserStore';

type RouteParams = {
  boardId: string;
};
const ArticleDetailPage = () => {
  const { boardId } = useParams() as RouteParams;
  const { data: article } = useGetArticle(Number(boardId));
  const { user } = useUserStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleMenuClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="container-header-nav">
      <Header
        left="back"
        right={article?.personalId === user.personalId ? 'menu' : undefined}
        onMenuClick={handleMenuClick}
      />
      <ArticleDropDown
        boardId={Number(boardId)}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />
      {article && <ArticleDetailContainer article={article} />}
    </div>
  );
};

export default ArticleDetailPage;
