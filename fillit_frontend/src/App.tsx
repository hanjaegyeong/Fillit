import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Message from '@/pages/Message';
import Profile from '@/pages/Profile';
import Search from '@/pages/Search';
import SignUp from './pages/SignUp';
import Voice from '@/pages/Voice';
import Notification from '@/pages/Notification';
import NavBar from '@/components/common/NavBar';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/message" element={<Message />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
      <NavBar />
    </>
  );
};

export default App;
