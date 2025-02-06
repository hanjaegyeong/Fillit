import { AddPhotiIcon, AddTagIcon } from '@/assets/assets';

interface ArticleNavBarProps {
  onAddPhoto: () => void;
  onAddTag: () => void;
}

const ArticleNavBar = ({ onAddPhoto, onAddTag }: ArticleNavBarProps) => {
  return (
    <nav className="fixed z-10 h-[6rem] bottom-0 w-full bg-white border-t">
      <div className="m-6">
        <div className="flex justify-around">
          <img
            src={AddPhotiIcon}
            onClick={onAddPhoto}
            className="cursor-pointer"
            alt="add photo icon"
          />
          <img
            src={AddTagIcon}
            onClick={onAddTag}
            className="cursor-pointer"
            alt="add tag icon"
          />
        </div>
      </div>
    </nav>
  );
};

export default ArticleNavBar;
