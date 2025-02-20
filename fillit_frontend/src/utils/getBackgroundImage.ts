import ArticleWithImage1 from '@/assets/images/article-bg-img-1.png';
import ArticleWithImage2 from '@/assets/images/article-bg-img-2.png';
import ArticleWithImage3 from '@/assets/images/article-bg-img-3.png';
import ArticleWithImage4 from '@/assets/images/article-bg-img-4.png';
import ArticleWithImage5 from '@/assets/images/article-bg-img-5.png';
import ArticleWithoutImage1 from '@/assets/images/article-bg-noimg-1.png';
import ArticleWithoutImage2 from '@/assets/images/article-bg-noimg-2.png';
import ArticleWithoutImage3 from '@/assets/images/article-bg-noimg-3.png';
import ArticleWithoutImage4 from '@/assets/images/article-bg-noimg-4.png';
import ArticleWithoutImage5 from '@/assets/images/article-bg-noimg-5.png';

export const getBackgroundImage = (
  boardId: number,
  hasImage: boolean
): string => {
  const ArticleWithImageList: string[] = [
    ArticleWithImage1,
    ArticleWithImage2,
    ArticleWithImage3,
    ArticleWithImage4,
    ArticleWithImage5,
  ];
  const ArticleWithoutImageList: string[] = [
    ArticleWithoutImage1,
    ArticleWithoutImage2,
    ArticleWithoutImage3,
    ArticleWithoutImage4,
    ArticleWithoutImage5,
  ];

  return hasImage
    ? ArticleWithImageList[boardId % 5]
    : ArticleWithoutImageList[boardId % 5];
};
