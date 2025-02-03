import ArticleListSection from '@/components/Article/ArticleListSection';
import Header from '@/components/common/Header';

const ArticleListPage = () => {
  return (
    <div className="container-header-nav">
      <Header left="home" right="notification" />
      <ArticleListSection />
    </div>
  );
};

export default ArticleListPage;
