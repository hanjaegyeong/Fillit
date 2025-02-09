import { useState } from 'react';
import Header from '@/components/common/Header/Header';
import ProfilePagePaper from '@/assets/icons/profile-page-paper.svg';
import { BackIcon } from '@/assets/assets';
import ArticleImage from '@/mocks/images/article-image.png';

const ProfileCustomPage = () => {
  const tempImages = [
    ArticleImage,
    ArticleImage,
    ArticleImage,
    ArticleImage,
    ArticleImage,
    ArticleImage,
    ArticleImage,
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    console.log(currentPage);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    console.log(currentPage);
  };

  return (
    <div className="container-header h-screen overflow-hidden">
      <Header left="back" text="Customizing My Profile🌟 " />

      {/* 이미지 스크롤 영역 */}
      <div className="fixed top-[8rem] w-full flex items-center max-w-[50rem]">
        <div className=" overflow-x-scroll flex gap-6 px-3 pb-4">
          {tempImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`temp image ${index + 1}`}
              className="w-20 h-20 object-cover"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* 프로필 페이지 배경 */}
        <div className="w-full object-cover flex justify-center scale-110 mt-[17rem]">
          <img src={ProfilePagePaper} alt="profile page paper" />
        </div>

        {/* 페이지 이동 버튼 */}
        <div className="w-full flex justify-between px-6 mt-[6%] z-30">
          <button
            onClick={handlePrevPage}
            className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center"
          >
            <img src={BackIcon} alt="back icon" className="w-6 h-6" />
          </button>
          {/* 페이지 */}
          <div className="flex items-center text-xl">{currentPage}</div>
          <button
            onClick={handleNextPage}
            className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center"
          >
            <img
              src={BackIcon}
              alt="back icon"
              className="w-6 h-6 -scale-x-100"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomPage;
