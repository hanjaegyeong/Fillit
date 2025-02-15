import { useState } from 'react';

interface ArticleThumbnailProps {
  imageUrl: string;
}

const ArticleThumbnail = ({ imageUrl }: ArticleThumbnailProps) => {
  const [isError, setIsError] = useState(false);

  return (
    <div className="flex justify-center">
      {isError ? (
        <div className="w-[15rem] aspect-[4/3] flex items-center justify-center bg-gray-200 rounded-sm">
          <span className="text-gray-500">Unable to load image</span>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt="thumbnail image"
          className="w-[15rem] aspect-[4/3] object-cover object-center drop-shadow-lg rounded-sm"
          onError={() => {
            setIsError(true);
          }}
        />
      )}
    </div>
  );
};

export default ArticleThumbnail;
