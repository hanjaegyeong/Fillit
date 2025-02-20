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
      <div className="w-full max-w-[600px] fixed bottom-28 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="relative w-full bottom-20">
          <button
            onClick={() => navigate('/newarticle')}
            className="absolute right-4 w-20 h-20 bg-white rounded-full border flex items-center justify-center border-[#B5B4F2] shadow-md pointer-events-auto"
          >
            <img
              src={NewArticleIcon}
              alt="new-article"
              className="h-14 w-14 drop-shadow-xl"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
