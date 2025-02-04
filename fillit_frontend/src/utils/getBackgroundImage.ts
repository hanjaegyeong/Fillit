import ArticleWithImage from '@/assets/images/article-bg-img-1.png';
import ArticleWithoutImage from '@/assets/images/article-bg-noimg-1.png';

export const getBackgroundImage = (hasImage: boolean): string => {
  return hasImage ? ArticleWithImage : ArticleWithoutImage;
};
