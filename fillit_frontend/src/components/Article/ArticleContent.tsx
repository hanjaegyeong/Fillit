import { Article } from '@/types/article';
import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import TimeStamp from '@/components/common/Timestamp';
import { truncateText } from '@/utils/truncateText';
import ArticleThumbnail from '@/components/Article/ArticleThumbnail';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import CommentBadge from '@/components/common/Badge/CommentBadge';

interface ArticleContentProps {
  article: Article;
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
      <div className="font-extralight text-s">
        {isDetail ? article.content : truncateText(article.content, 130)}
      </div>
      {article.imageUrls[0] && (
        <ArticleThumbnail imageUrl={article.imageUrls[0]} />
      )}
      <div className="flex gap-5">
        <LikeBadge likeCount={article.likeCount} isLiked={true} />
        <CommentBadge commentCount={article.commentCount} />
      </div>
    </>
  );
};

export default ArticleContent;
