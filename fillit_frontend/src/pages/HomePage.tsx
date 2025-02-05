import ArticleListContainer from '@/components/Article/ArticleListContainer';
import Header from '@/components/common/Header/Header';

const HomePage = () => {
  return (
    <div className="container-header-nav">
      <Header left="home" right="notification" />
      <ArticleListContainer />
    </div>
  );
};

export default HomePage;
