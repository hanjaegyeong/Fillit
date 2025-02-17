import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/common/Header/Header';
import { NewArticleImg } from '@/assets/assets';
import ArticleNavBar from '@/components/common/NavBar/ArticleNavBar';
import AiFilButton from '@/components/common/Button/AiFilButton';
import { TagSelectModal } from '@/components/common/Modal/TagSelectModal';
import { KeywordModal } from '@/components/common/Modal/KeywordModal';
import ImageSlider from '@/components/common/ImageSlider';
import { getArticle, putArticle } from '@/api/article';
import { ArticlePostForm } from '@/types/article';
import { ARTICLE_MAX_LENGTH } from '@/constants/system';

const EditArticlePage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [content, setContent] = useState('');
  // 기존 이미지 URL과 새로 업로드한 파일을 따로 관리합니다.
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState<boolean>(false);

  // 페이지 로드 시 기존 게시글 정보를 불러옴
  useEffect(() => {
    console.log(Number(boardId));
    if (!boardId) return;
    getArticle(Number(boardId))
      .then((article) => {
        setContent(article.content);
        // 서버 응답에 기존 이미지 URL들이 있다면 미리보기용으로 설정
        setUploadedImages(article.imageUrls || []);
        setSelectedTags(article.interests || []);
      })
      .catch((err) =>
        console.error('게시글 정보를 불러오는데 실패했습니다:', err)
      );
  }, [boardId]);

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

  // 관심사 태그 관련 함수
  const handleOpenTagModal = () => setIsTagModalOpen(true);
  const handleCloseTagModal = () => setIsTagModalOpen(false);
  const handleConfirmTags = (tags: string[]) => {
    setSelectedTags(tags);
    setIsTagModalOpen(false);
  };

  // 키워드 관련 함수
  const handleOpenKeywordModal = () => setIsKeywordModalOpen(true);
  const handleCloseKeywordModal = () => setIsKeywordModalOpen(false);
  const handleConfirmKeyword = (keyword: string) => {
    setIsKeywordModalOpen(false);
    handleSubmit(keyword);
  };

  // 게시글 수정 제출 함수
  const handleSubmit = async (keyword: string) => {
    if (!boardId) return;
    const articlePostForm: ArticlePostForm = {
      board: {
        content,
        x: 0, // 필요에 따라 좌표값 설정
        y: 0,
        z: 0,
        keyword,
        pageNumber: 1,
        interests: selectedTags,
      },
      // 새로 업로드한 파일만 전송합니다.
      boardImages: uploadedFiles,
    };

    try {
      await putArticle(Number(boardId), articlePostForm);
      // 수정 완료 후 적절한 페이지로 이동하거나 성공 메시지 표시
    } catch (error) {
      console.error('게시글 수정 중 오류 발생:', error);
    }
  };

  return (
    <div className="container-header">
      <Header
        left="back"
        right="regist"
        onRegistClick={handleOpenKeywordModal}
      />
      <div className="relative w-full overflow-hidden min-h-screen pb-40">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 flex justify-center">
          <img
            src={NewArticleImg}
            className="max-w-[750px] w-full object-cover"
            alt="paper background"
          />
        </div>
        {/* 게시글 내용 입력 영역 */}
        <div className="relative z-10 pt-24 pl-20 pr-5">
          <textarea
            className="w-full min-h-[23vh] font-extralight text-2xl bg-transparent outline-none placeholder:text-gray-400"
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={ARTICLE_MAX_LENGTH}
          />
        </div>
        {/* 이미지 미리보기 영역 */}
        {uploadedImages.length > 0 && (
          <div className="m-5 overflow-x-auto">
            <div className="pl-14 pr-5">
              <ImageSlider images={uploadedImages} />
            </div>
          </div>
        )}
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
          onConfirm={handleConfirmTags}
        />
      )}
      {isKeywordModalOpen && (
        <KeywordModal
          isOpen={isKeywordModalOpen}
          onClose={handleCloseKeywordModal}
          onConfirm={handleConfirmKeyword}
        />
      )}
    </div>
  );
};

export default EditArticlePage;
