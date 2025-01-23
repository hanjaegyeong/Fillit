import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MessagePage from './pages/MessagePage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import VoicePage from './pages/VoicePage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/message" element={<MessagePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/voice" element={<VoicePage />} />
    </Routes>
  );
};

export default App;
