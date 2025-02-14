import { Article, FeedArticle } from '@/types/article';
import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import TimeStamp from '@/components/common/Timestamp';
import { truncateText } from '@/utils/truncateText';
import ArticleThumbnail from '@/components/Article/ArticleThumbnail';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import CommentBadge from '@/components/common/Badge/CommentBadge';

interface ArticleContentProps {
  article: FeedArticle | Article;
  isDetail?: boolean;
}

const ArticleContent = ({ article, isDetail = false }: ArticleContentProps) => {
  const imageUrl =
    'imageUrl' in article ? article.imageUrl : article.imageUrls[0];

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
      <div className="font-extralight text-base w-[15.2rem]">
        {isDetail ? article.content : truncateText(article.content, 60)}
      </div>
      <div className="flex justify-center">
        {imageUrl && <ArticleThumbnail imageUrl={imageUrl} />}
      </div>
      <div className="flex gap-5 pt-0.5">
        <LikeBadge
          type="article"
          id={article.boardId}
          initialLikeCount={article.likeCount}
          initialIsLiked={article.isLiked}
        />
        <CommentBadge commentCount={article.commentCount} />
      </div>
    </>
  );
};

export default ArticleContent;
