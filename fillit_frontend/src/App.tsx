import { Routes, Route } from 'react-router-dom';
import ArticleListPage from '@/pages/ArticleListPage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import Find from './pages/Find';
import Login from '@/pages/Login';
import Message from '@/pages/Message';
import Profile from '@/pages/Profile';
import Search from '@/pages/Search';
import SignUp from './pages/SignUp';
import Social from '@/pages/SocialSignUp';
import Voice from '@/pages/Voice';
import Notification from '@/pages/Notification';
import NavBar from '@/components/common/NavBar';

const App = () => {
  return (
    <>
      <div className="bg-home-bg bg-fixed"></div>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/article/:boardId" element={<ArticleDetailPage />} />
        <Route path="/find" element={<Find />} />
        <Route path="/login" element={<Login />} />
        <Route path="/message" element={<Message />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/socialsignup" element={<Social />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
      <NavBar />
    </>
  );
};

export default App;
