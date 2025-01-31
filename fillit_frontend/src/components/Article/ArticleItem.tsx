import { Article } from '@/types/article';
import TimeStamp from '@/components/common/Timestamp';
import LikeBadge from '@/components/common/Badge/LikeBadge';
import ProfileBadge from '@/components/common/Badge/ProfileBadge';
import { getBackgroundImage } from '@/utils/getBackgroundImage';
import CommentBadge from '../common/Badge/CommentBadge';
import { useNavigate } from 'react-router-dom';

interface ArticleItemProps {
  article: Article;
  position: 'left' | 'right';
}

const ArticleItem = ({ article, position }: ArticleItemProps) => {
  const navigate = useNavigate();

  const handleGoArticleDetail = () => {
    navigate(`/article/${article.boardId}`);
  };

  return (
    <div
      className={`bg-contain bg-no-repeat bg-center h-48 w-96 flex items-center ${
        position === 'left' ? 'mr-20' : 'ml-20'
      } -mb-6 pb-1`}
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      onClick={handleGoArticleDetail}
    >
      <div className="flex flex-col gap-3 px-14">
        <div className="flex items-center gap-4">
          <ProfileBadge
            profileImageUrl={article.profileImageUrl}
            personalId={article.personalId}
          />
          <TimeStamp date={article.createdAt} />
        </div>
        <div className="font-extralight text-s">{article.content}</div>
        <div className="flex gap-5">
          <LikeBadge likeCount={article.likeCount} isLiked={true} />
          <CommentBadge commentCount={article.commentCount} />
        </div>
      </div>
    </div>
  );
};

export default ArticleItem;
