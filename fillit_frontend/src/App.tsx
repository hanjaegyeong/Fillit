import { RouterProvider } from 'react-router-dom';
import router from '@/router';
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
      <RouterProvider router={router} />
    </>
  );
};

export default App;
