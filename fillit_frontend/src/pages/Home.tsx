import Header from '@/components/common/Header';
import ProfileImage from '@/assets/images/profile-image.png';

const Home = () => {
  return (
    <>
      <Header left="home" profileImage={ProfileImage} right="notification" />
      <h1>Home</h1>
    </>
  );
};

export default Home;
