import Header from '@/components/common/Header/Header';
import { useParams } from 'react-router-dom';

const ArticleDetailPage = () => {
  const { boardId } = useParams();

  return (
    <div className="flex flex-col items-center h-screen">
      <Header left="back" right="menu" />
      <div className="pt-[4.6rem]">
        <h1>Article Detail Page #{boardId}</h1>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
