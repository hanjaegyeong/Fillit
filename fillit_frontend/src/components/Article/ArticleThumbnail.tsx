interface ArticleThumbnailProps {
  imageUrl: string;
}

const ArticleThumbnail = ({ imageUrl }: ArticleThumbnailProps) => {
  return (
    <img
      src={imageUrl}
      alt="thumbnail image"
      className="px-1 h-48 w-full object-cover drop-shadow-lg"
    />
  );
};

export default ArticleThumbnail;
