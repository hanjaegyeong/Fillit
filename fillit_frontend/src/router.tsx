import { createBrowserRouter } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import CommentDetailPage from '@/pages/CommentDetailPage';

import LoginPage from '@/pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SocialSignUpPage from '@/pages/SocialSignUpPage';
import FindPasswordPage from './pages/FindPasswordPage';

import MessageListPage from '@/pages/MessageListPage';
import MessagePage from '@/pages/MessagePage';
import NewMessagePage from '@/pages/NewMassagePage';

import ProfilePage from '@/pages/ProfilePage';
import ProfileEditPage from '@/pages/ProfileEditPage';

import SearchPage from '@/pages/SearchPage';
import VoicePage from '@/pages/VoicePage';
import NotificationPage from '@/pages/NotificationPage';

import Layout from './components/common/Layout/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'article/:boardId',
        children: [
          {
            path: '',
            element: <ArticleDetailPage />,
          },
          {
            path: 'comment/:commentId',
            element: <CommentDetailPage />,
          },
        ],
      },
      {
        path: 'message',
        children: [
          {
            path: '',
            element: <MessageListPage />,
          },
          {
            path: ':chatId',
            element: <MessagePage />,
          },
        ],
      },
      {
        path: 'profile/:personalId',
        children: [
          {
            path: '',
            element: <ProfilePage />,
          },
          {
            path: 'edit',
            element: <ProfileEditPage />,
          },
        ],
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'voice',
        element: <VoicePage />,
      },
      {
        path: 'notification',
        element: <NotificationPage />,
      },
      {
        path: 'newmessage',
        element: <NewMessagePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/find',
    element: <FindPasswordPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/socialsignup',
    element: <SocialSignUpPage />,
  },
]);

export default router;
