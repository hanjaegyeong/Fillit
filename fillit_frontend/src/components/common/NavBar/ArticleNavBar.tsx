import { AddPhotiIcon, AddTagIcon } from '@/assets/assets';

interface ArticleNavBarProps {
  onAddPhoto: () => void;
  onAddTag: () => void;
}

const ArticleNavBar = ({ onAddPhoto, onAddTag }: ArticleNavBarProps) => {
  return (
    <nav className="z-10 h-[5rem] fixed bottom-0 w-full bg-white border-t">
      <div className="flex items-center justify-around h-full pb-4">
        <img
          src={AddPhotiIcon}
          onClick={onAddPhoto}
          className="cursor-pointer"
          alt="photo icon"
        />
        <img
          src={AddTagIcon}
          onClick={onAddTag}
          className="cursor-pointer"
          alt="tag icon"
        />
      </div>
    </nav>
  );
};

export default ArticleNavBar;
