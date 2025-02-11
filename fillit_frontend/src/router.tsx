import { createBrowserRouter } from 'react-router-dom';

import HomePage from '@/pages/HomePage';
import NewArticlePage from '@/pages/NewArticlePage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import CommentDetailPage from '@/pages/CommentDetailPage';

import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import SocialSignUpPage from '@/pages/SocialSignUpPage';
import FindPasswordPage from '@/pages/FindPasswordPage';

import MessageListPage from '@/pages/MessageListPage';
import MessagePage from '@/pages/MessagePage';
import NewMessagePage from '@/pages/NewMassagePage';

import ProfilePage from '@/pages/ProfilePage';
import ProfileEditPage from '@/pages/ProfileEditPage';
import ProfileCustomPage from '@/pages/ProfileCustomPage';
import FollowerPage from '@/pages/FollowerPage';
import FollowingPage from '@/pages/FollowingPage';

import SearchPage from '@/pages/SearchPage';
import VoicePage from '@/pages/VoicePage';
import NotificationPage from '@/pages/NotificationPage';

import Layout from '@/components/common/Layout/Layout';

import ProtectedRoute from '@/ProtectedRoute';
import PublicRoute from '@/PublicRoute';

const router = createBrowserRouter([
  {
    // 보호된 경로: 토큰이 있을 경우에만 접근 가능
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { path: '', element: <HomePage /> },
          {
            path: 'article/:boardId',
            children: [
              { path: '', element: <ArticleDetailPage /> },
              { path: 'comment/:commentId', element: <CommentDetailPage /> },
            ],
          },
          {
            path: 'message',
            children: [
              { path: '', element: <MessageListPage /> },
              { path: ':chatId', element: <MessagePage /> },
            ],
          },
          {
            path: 'profile/:personalId',
            children: [
              { path: '', element: <ProfilePage /> },
              { path: 'follower', element: <FollowerPage /> },
              { path: 'following', element: <FollowingPage /> },
            ],
          },
          { path: 'search', element: <SearchPage /> },
          { path: 'voice', element: <VoicePage /> },
          { path: 'notification', element: <NotificationPage /> },
          { path: 'newmessage', element: <NewMessagePage /> },
        ],
      },
      { path: 'newarticle', element: <NewArticlePage /> },
      { path: 'edit', element: <ProfileEditPage /> },
      { path: 'customize', element: <ProfileCustomPage /> },
    ],
  },
  {
    // 공개 경로: 로그인하지 않은 사용자만 접근 가능
    element: <PublicRoute />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'find', element: <FindPasswordPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'socialsignup', element: <SocialSignUpPage /> },
    ],
  },
]);

export default router;
