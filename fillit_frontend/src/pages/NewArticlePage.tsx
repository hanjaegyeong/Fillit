import { useState, useRef } from 'react';

import Header from '@/components/common/Header/Header';
import { NewArticleImg } from '@/assets/assets';
import ArticleNavBar from '@/components/common/NavBar/ArticleNavBar';
import AiFilButton from '@/components/common/Button/AiFilButton';
import { TagSelectModal } from '@/components/common/Modal/TagSelectModal';
import { KeywordModal } from '@/components/common/Modal/KeywordModal';

import { postArticle } from '@/api/article';
import { postInterest } from '@/api/interest';
import { ArticlePostForm } from '@/types/article';

const NewArticlePage = () => {
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
    setUploadedFiles((prev) => [...prev, ...files]);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 관심사 태그
  const handleOpenTagModal = () => {
    setIsTagModalOpen(true);
  };
  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
  };
  const handleConfirmTags = (tags: string[]) => {
    setSelectedTags(tags);
    setIsTagModalOpen(false);
  };

  // 키워드
  const handleOpenKeywordModal = () => {
    setIsKeywordModalOpen(true);
  };
  const handleCloseKeywordModal = () => {
    setIsKeywordModalOpen(false);
  };
  const handleConfirmKeyword = (keyword: string) => {
    setIsKeywordModalOpen(false);
    handleSubmit(keyword);
  };

  // 게시글 등록
  const handleSubmit = async (keyword: string) => {
    const articlePostForm: ArticlePostForm = {
      board: {
        content,
        x: 0,
        y: 0,
        z: 0,
        keyword,
        pageNumber: 1,
        interests: selectedTags,
      },
      boardImages: uploadedFiles,
    };

    try {
      const articleData = await postArticle(articlePostForm);
      console.log('게시글 정보 전송 성공', articleData);
      if (selectedTags.length > 0) {
        await postInterest(articleData.personalId, selectedTags);
        console.log('관심사 태그 추가 완료');
      }
    } catch (error) {
      console.error('게시글 작성 실패', error);
    }
  };

  return (
    <div className="container-header">
      <Header
        left="back"
        right="regist"
        onRegistClick={handleOpenKeywordModal}
      />
      <div className="w-full max-w-[600px] overflow-auto botton-[10rem]">
        {/* 배경 종이 이미지 */}
        <img
          src={NewArticleImg}
          className="fixed -left-2 bottom-0 max-w-[750px]"
          alt="paper background"
        />
        {/* 텍스트 입력 및 이미지 미리보기 영역 */}
        <div className="relative z-10 pt-24 pl-24 pr-5">
          <textarea
            className="w-full min-h-[40vh] font-extralight text-2xl bg-transparent outline-none  placeholder:text-gray-400"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {isTagModalOpen && (
        <TagSelectModal
          isOpen={isTagModalOpen}
          selectedTags={selectedTags}
          onClose={handleCloseTagModal}
          onConfirm={handleConfirmTags} // 선택 동작을 추가 가능
        />
      )}

      {isKeywordModalOpen && (
        <KeywordModal
          isOpen={isKeywordModalOpen}
          onClose={handleCloseKeywordModal}
          onConfirm={handleConfirmKeyword} // 선택 동작을 추가 가능
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
