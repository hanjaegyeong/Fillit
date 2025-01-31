import ArticleListSection from '@/components/Article/ArticleListSection';
import Header from '@/components/common/Header';

const ArticleListPage = () => {
  return (
    <div className="flex flex-col items-center h-screen">
      <Header left="home" right="notification" />
      <ArticleListSection />
    </div>
  );
};

export default ArticleListPage;
