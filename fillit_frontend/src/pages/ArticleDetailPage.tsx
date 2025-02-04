import ArticleDetailContainer from '@/components/Article/ArticleDetailContainer';
import Header from '@/components/common/Header/Header';

const ArticleDetailPage = () => {
  return (
    <div className="container-header-nav">
      <Header left="back" right="menu" />
      <ArticleDetailContainer />
    </div>
  );
};

export default ArticleDetailPage;
