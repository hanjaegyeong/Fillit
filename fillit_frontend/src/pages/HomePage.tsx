import ArticleListContainer from '@/components/Article/ArticleListContainer';
import Header from '@/components/common/Header/Header';
import { NewArticleIcon } from '@/assets/assets';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="container-header-nav">
      <Header left="home" right="notification" />
      <ArticleListContainer />
      <div className="w-full max-w-[600px] flex justify-end px-4 fixed bottom-28">
        <button
          onClick={() => navigate('/newarticle')}
          className="h-20 w-20 bg-white rounded-full border-black border flex items-center justify-center shadow-md"
        >
          <img
            src={NewArticleIcon}
            alt="new-article"
            className="h-12 w-12 drop-shadow-xl"
          />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
