interface ArticleThumbnailProps {
  imageUrl: string;
}

const ArticleThumbnail = ({ imageUrl }: ArticleThumbnailProps) => {
  return (
    <div className="flex justify-center">
      <img
        src={imageUrl}
        alt="thumbnail image"
        className="aspect-[4/3] w-[15rem] object-cover object-center drop-shadow-lg rounded-sm"
      />
    </div>
  );
};

export default ArticleThumbnail;
