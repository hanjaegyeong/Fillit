import { Article, FeedArticle } from '@/types/article';
import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import TimeStamp from '@/components/common/Timestamp';
import { truncateText } from '@/utils/truncateText';
import ArticleThumbnail from '@/components/Article/ArticleThumbnail';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import CommentBadge from '@/components/common/Badge/CommentBadge';
import ImageSlider from '../common/ImageSlider';

interface ArticleContentProps {
  article: FeedArticle | Article;
  isDetail?: boolean;
}

const ArticleContent = ({ article, isDetail = false }: ArticleContentProps) => {
  return (
    <>
      <div
        className={`flex items-center ${
          isDetail ? 'justify-between' : 'gap-4'
        }`}
      >
        <ProfileBadge
          profileImageUrl={article.profileImageUrl}
          personalId={article.personalId}
        />
        <TimeStamp date={article.createdAt} />
      </div>
      <div
        className={`font-extralight text-base break-words ${
          isDetail ? 'leading-snug' : 'leading-tight w-[15.2rem]'
        }`}
      >
        {isDetail ? article.content : truncateText(article.content, 55)}
      </div>
      <div className="flex justify-center">
        {'imageUrl' in article && article.imageUrl && (
          <ArticleThumbnail imageUrl={article.imageUrl} />
        )}
        {!isDetail && 'imageUrls' in article && article.imageUrls[0] && (
          <ArticleThumbnail imageUrl={article.imageUrls[0]} />
        )}
        {isDetail && 'imageUrls' in article && article.imageUrls && (
          <ImageSlider images={article.imageUrls} />
        )}
      </div>
      <div className="flex justify-between pt-0.5">
        <div className="flex gap-5">
          <LikeBadge
            type="article"
            id={article.boardId}
            initialLikeCount={article.likeCount}
            initialIsLiked={article.isLiked}
          />
          <CommentBadge commentCount={article.commentCount} />
        </div>
        {'isRecommended' in article && article.isRecommended && (
          <div className="text-xxs font-extralight translate-x-2.5 translate-y-0.5 bg-white px-2 border rounded-full border-[#83C9EC]">
            Recommended Post
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleContent;
