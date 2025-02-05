import { Routes, Route } from 'react-router-dom';
import ArticleListPage from '@/pages/ArticleListPage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import CommentDetailPage from '@/pages/CommentDetailPage';
import FindPage from './pages/FindPage';
import LoginPage from '@/pages/LoginPage';
import MessageListPage from '@/pages/MessageListPage';
import MessagePage from '@/pages/MessagePage';
import ProfilePage from '@/pages/ProfilePage';
import SearchPage from '@/pages/SearchPage';
import SignUpPage from './pages/SignUpPage';
import SocialPage from '@/pages/SocialSignUpPage';
import VoicePage from '@/pages/VoicePage';
import NotificationPage from '@/pages/NotificationPage';
import NavBar from '@/components/common/NavBar/NavBar';
import NewMessage from '@/pages/NewMassagePage';
import { ProfileEditPage } from '@/pages/ProfileEditPage';
import FollowerPage from './pages/FollowerPage';
import FollowingPage from './pages/FollowingPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/article/:boardId" element={<ArticleDetailPage />} />
        <Route path="/comment" element={<CommentDetailPage />} />
        <Route path="/find" element={<FindPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/message" element={<MessageListPage />} />
        <Route path="/message/:chatId" element={<MessagePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/follower" element={<FollowerPage />} />
        <Route path="/following" element={<FollowingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/socialsignup" element={<SocialPage />} />
        <Route path="/voice" element={<VoicePage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/newmessage" element={<NewMessage />} />
      </Routes>
      <NavBar />
    </>
  );
};

export default App;
