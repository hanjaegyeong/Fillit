import { useState, useEffect, useCallback } from 'react';
// import { Article } from '@/types/article';
import useGetUserArticleList from '@/hooks/query/useGetUserArticleList';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';
import { getPaperText } from '@/utils/getPaperText';
import { useNavigate } from 'react-router-dom';
import CustomPaper from '@/assets/images/custom-paper.png';

interface ProfileArticleGridProps {
  personalId: string;
}

const ProfileArticleGrid = ({ personalId }: ProfileArticleGridProps) => {
  // 사용자의 게시물 목록을 가져오는 커스텀 훅
  const { data: articleList, isLoading } = useGetUserArticleList(personalId);
  const [currentPage, setCurrentPage] = useState(1);
  const [thumbnails, setThumbnails] = useState<{ [key: number]: string }>({});
  const [keywordImages, setKeywordImages] = useState<{ [key: number]: string }>(
    {}
  );
  const navigate = useNavigate();

  // 한 페이지당 보여줄 게시글 수, 전체 페이지 수
  const articlesPerPage = 4;
  const totalPages = articleList
    ? Math.ceil(articleList.length / articlesPerPage)
    : 0;

  // 현재 페이지에 표시할 게시글 목록을 반환
  const getCurrentPageArticles = useCallback(() => {
    if (!articleList) return [];
    const startIndex = (currentPage - 1) * articlesPerPage;
    return articleList.slice(startIndex, startIndex + articlesPerPage);
  }, [currentPage, articleList, articlesPerPage]);

  // 썸네일 및 키워드 이미지 생성
  useEffect(() => {
    const generateThumbnails = async () => {
      const currentArticles = getCurrentPageArticles();
      const newThumbnails: { [key: number]: string } = {};
      const newKeywordImages: { [key: number]: string } = {};

      for (const article of currentArticles) {
        if (article.imageUrls && article.imageUrls[0]) {
          newThumbnails[article.boardId] = article.imageUrls[0];
        } else {
          // 배경 이미지 설정
          newThumbnails[article.boardId] = CustomPaper;
          // 키워드 이미지 크기
          const keywordImage = await getPaperText(article.keyword, 500);
          if (keywordImage) {
            newKeywordImages[article.boardId] = keywordImage;
          }
        }
      }

      setThumbnails(newThumbnails);
      setKeywordImages(newKeywordImages);
    };

    generateThumbnails();
  }, [currentPage, articleList, getCurrentPageArticles]);
  // 게시글 클릭하여 상세 페이지로 이동
  const handleArticleClick = (boardId: number) => {
    navigate(`/article/${boardId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-[600px] scale-[80%] mt-[2rem] pl-5 pr-2 -rotate-6">
        {/* 그리드 컨테이너*/}
        <div className="grid grid-cols-2 gap-x-5">
          {getCurrentPageArticles().map((article) => (
            <div
              key={article.boardId}
              onClick={() => handleArticleClick(article.boardId)}
              className={`aspect-square cursor-pointer overflow-hidden relative ${
                article.imageUrls?.[0]
                  ? 'rounded-lg shadow-md hover:shadow-lg transition-shadow rotate-12'
                  : ' w-60 h-52 pr-10 pt-2 -translate-x-5 -translate-y-5'
              }`}
            >
              {thumbnails[article.boardId] && (
                <>
                  <img
                    src={thumbnails[article.boardId]}
                    alt={article.keyword}
                    className="w-full h-full"
                  />
                  {!article.imageUrls?.[0] &&
                    keywordImages[article.boardId] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={keywordImages[article.boardId]}
                          alt={article.keyword}
                          className="w-[100%] h-auto object-cover"
                        />
                      </div>
                    )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 페이지네이션  */}
      {totalPages > 1 && (
        <div className="absolute left-1/2 transform -translate-x-1/2 -mt-8">
          <div className="flex justify-items-stretch items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md text-[#5E72E4] bg-gray-100 disabled:opacity-50"
            >
              ◀
            </button>
            <span className="text-lg tracking-tighter">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md text-[#5E72E4] bg-gray-100 disabled:opacity-50"
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileArticleGrid;
