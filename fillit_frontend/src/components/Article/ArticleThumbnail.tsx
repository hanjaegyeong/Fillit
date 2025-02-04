interface ArticleThumbnailProps {
  imageUrl: string;
}

const ArticleThumbnail = ({ imageUrl }: ArticleThumbnailProps) => {
  return (
    <div className="flex justify-center">
      <img
        src={imageUrl}
        alt="thumbnail image"
        className="px-1 h-48 w-full max-w-[320px] object-cover drop-shadow-lg"
      />
    </div>
  );
};

export default ArticleThumbnail;
