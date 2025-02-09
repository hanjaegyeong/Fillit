import Header from '@/components/common/Header/Header';
import { NewArticleImg } from '@/assets/assets';
import ArticleNavBar from '@/components/common/NavBar/ArticleNavBar';
import { useState, useRef } from 'react';
import AiFilButton from '@/components/common/Button/AiFilButton';
import { TagSelectModal } from '@/components/common/Modal/TagSelectModal';
import { KeywordModal } from '@/components/common/Modal/KeywordModal';

const NewArticlePage = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState<boolean>(false);

  const handleAddPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (uploadedImages.length + files.length > 10) {
      alert('최대 10개의 이미지만 업로드할 수 있습니다.');
      return;
    }
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenTagModal = () => {
    setIsTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
  };

  const handleOpenKeywordModal = () => {
    setIsKeywordModalOpen(true);
  };

  const handleCloseKeywordModal = () => {
    setIsKeywordModalOpen(false);
  };

  return (
    <div className="container-header">
      <Header
        left="back"
        right="regist"
        onRegistClick={handleOpenKeywordModal}
      />
      <div className="h-4/5 w-full max-w-[600px] overflow-auto botton-[10rem]">
        {/* 배경 종이 이미지 */}
        <img
          src={NewArticleImg}
          className="absolute h-full w-full max-w-[600px] top-0 object-cover origin-top"
          alt="paper background"
        />
        {/* 텍스트 입력 및 이미지 미리보기 영역 */}
        <div className="relative z-10 pt-20 pl-20 pr-5">
          <textarea
            className="w-full min-h-[40vh] font-extralight text-2xl bg-transparent outline-none  placeholder:text-gray-400"
            placeholder="What's happening?"
          />
          {/* 가로 스크롤 오버플로우 바 */}
          {uploadedImages.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <div className="flex space-x-4">
                {uploadedImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`upload preview ${index + 1}`}
                    className="w-24 h-24 object-cover cursor-pointer"
                    onClick={() => handleRemoveImage(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <AiFilButton />
        </div>
      </div>
      <ArticleNavBar
        onAddPhoto={handleAddPhoto}
        onAddTag={handleOpenTagModal}
      />

      {isTagModalOpen && (
        <TagSelectModal
          isOpen={isTagModalOpen}
          onClose={handleCloseTagModal}
          onConfirm={() => console.log('Tag Selected!')} // 선택 동작을 추가 가능
        />
      )}

      {isKeywordModalOpen && (
        <KeywordModal
          isOpen={isKeywordModalOpen}
          onClose={handleCloseKeywordModal}
          onConfirm={() => console.log('Keyword Selected!')} // 선택 동작을 추가 가능
        />
      )}

      {/* 숨겨진 파일 입력 요소 */}
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default NewArticlePage;
