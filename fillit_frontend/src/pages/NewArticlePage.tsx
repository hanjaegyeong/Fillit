import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/common/Header/Header';
import { NewArticleImg } from '@/assets/assets';
import ArticleNavBar from '@/components/common/NavBar/ArticleNavBar';
import AiFilButton from '@/components/common/Button/AiFilButton';
import { TagSelectModal } from '@/components/common/Modal/TagSelectModal';
import { KeywordModal } from '@/components/common/Modal/KeywordModal';

import { postArticle } from '@/api/article';
import { ArticlePostForm } from '@/types/article';
import ImageSlider from '@/components/common/ImageSlider';
import { ARTICLE_MAX_LENGTH } from '@/constants/system';
import { INTEREST_TAGS } from '@/constants/interestTags';
import InterestTagChip from '@/components/common/InterestTagChip';
import useInput from '@/hooks/useInput';

const NewArticlePage = () => {
  const {
    value: content,
    onChange: handleContentChange,
    onBeforeInput,
  } = useInput('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleAddPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
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

  // 게시글 작성에서 태그 제거
  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
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
      await postArticle(articlePostForm);
      navigate('/');
    } catch (error) {
      console.log('게시글 등록 오류 : ', error);
    }
  };

  return (
    <div className="container-header">
      <Header
        left="back"
        right="regist"
        onRegistClick={handleOpenKeywordModal}
      />
      {/* 배경 종이 이미지 */}
      <div className="fixed top-[7.8%] max-w-[600px]">
        <img
          src={NewArticleImg}
          alt="paper background"
          className="h-[88vh] object-cover object-left"
        />
      </div>
      <div className="pt-28" />
      <div className="w-full overflow-auto pb-40 scrollbar-hide">
        {/* 텍스트 입력 및 이미지 미리보기 영역 */}
        <div className="relative z-10 pl-24 pr-5">
          <textarea
            ref={textareaRef}
            className="w-full font-extralight text-2xl bg-transparent outline-none  placeholder:text-gray-500"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            placeholder="What's happening?"
            value={content}
            onChange={handleContentChange}
            onBeforeInput={onBeforeInput}
            maxLength={ARTICLE_MAX_LENGTH}
          />
        </div>
        {/* 가로 스크롤 오버플로우 바 */}
        {uploadedImages.length > 0 && (
          <div className="m-5 overflow-x-auto">
            <div className="flex justify-center">
              <ImageSlider
                images={uploadedImages}
                onRemove={handleRemoveImage}
              />
            </div>
          </div>
        )}
        {/* 관심사 태그 표시 영역 */}
        <div className="mt-2 ml-24 flex flex-wrap">
          {selectedTags.map((tag) => {
            const tagData = INTEREST_TAGS.find((item) => item.label === tag);
            return (
              <InterestTagChip
                key={tag}
                tag={tag}
                icon={tagData ? tagData.icon : ''}
                onRemove={() => handleRemoveTag(tag)}
              />
            );
          })}
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
