import { useState, useEffect, useCallback, useMemo } from 'react';
// import { Article } from '@/types/article';
import useGetUserArticleList from '@/hooks/query/useGetUserArticleList';
import LoadingSpinner from '@/components/common/Loading/LoadingSpinner';
import { getPaperText } from '@/utils/getPaperText';
import { useNavigate } from 'react-router-dom';
import CustomPaper from '@/assets/images/custom-paper.png';
import { CategoryModal } from '@/components/common/Modal/CategoryModal';
import { INTEREST_TAGS } from '@/constants/interestTags';

interface ProfileArticleGridProps {
  personalId: string;
}

const ProfileArticleGrid = ({ personalId }: ProfileArticleGridProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
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

  // 필터링된 게시글 목록
  const filteredArticles = useMemo(() => {
    if (!articleList) return [];
    if (selectedInterests.length === 0) return articleList;
    return articleList.filter((article) =>
      article.interests.some((interest) => selectedInterests.includes(interest))
    );
  }, [articleList, selectedInterests]);

  // 현재 페이지에 표시할 게시글 목록을 반환
  const getCurrentPageArticles = useCallback(
    (articles: typeof articleList) => {
      if (!articles) return [];
      const startIndex = (currentPage - 1) * articlesPerPage;
      return articles.slice(startIndex, startIndex + articlesPerPage);
    },
    [currentPage, articlesPerPage]
  );

  // 썸네일 및 키워드 이미지 생성
  useEffect(() => {
    const generateThumbnails = async () => {
      const currentArticles = getCurrentPageArticles(filteredArticles);
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
  }, [currentPage, filteredArticles, getCurrentPageArticles]);

  // 게시글 클릭하여 상세 페이지로 이동
  const handleArticleClick = (boardId: number) => {
    navigate(`/article/${boardId}`);
  };

  const handleInterestSelect = (interests: string[]) => {
    setSelectedInterests(interests);
    setIsCategoryModalOpen(false);
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
      {/* 카테고리 선택 버튼 */}
      <div className="w-full flex justify-end scale-[80%]">
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-sm -mr-8 mt-16"
        >
          {selectedInterests.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 max-w-[300px]">
              {selectedInterests.map((interest) => {
                const tagData = INTEREST_TAGS.find(
                  (tag) => tag.label === interest
                );
                return (
                  <div key={interest} className="flex items-center gap-1">
                    {tagData && (
                      <img
                        src={tagData.icon}
                        alt={interest}
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            '🩵All Categories'
          )}
        </button>
      </div>
      <div className="w-full max-w-[600px] scale-[80%] -mt-2 pl-5 pr-2 -rotate-6">
        {/* 그리드 컨테이너*/}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 -mt-7">
            {getCurrentPageArticles(filteredArticles).map((article) => (
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
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-500 text-4xl mb-20">
            Oops!
            <br /> There are no posts
            <br /> in this category yet.
          </div>
        )}
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

      {/* 카테고리 모달 */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelect={handleInterestSelect}
        selectedCategory={selectedInterests}
      />
    </>
  );
};

export default ProfileArticleGrid;
