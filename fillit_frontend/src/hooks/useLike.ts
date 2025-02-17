import { useState } from 'react';
import useToggleLike from './query/useToggleLike';

interface useLikeProps {
  type: 'article' | 'comment' | 'reply';
  id: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
}

const useLike = ({
  type,
  id,
  initialIsLiked,
  initialLikeCount,
}: useLikeProps) => {
  const [liked, setLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialLikeCount);

  const { mutate: toggleLike, isPending } = useToggleLike();

  const handleToggleLike = (e: React.MouseEvent) => {
    if (isPending) return;

    setLiked((isLiked) => !isLiked);
    setCount(() => (liked ? count - 1 : count + 1));

    toggleLike({ type, id, isLiked: !liked });
    e.stopPropagation();
  };

  return { liked, count, handleToggleLike };
};

export default useLike;
