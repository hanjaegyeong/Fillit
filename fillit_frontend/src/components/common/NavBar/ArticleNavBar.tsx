import { AddPhotiIcon, AddTagIcon } from '@/assets/assets';
import AiFilButton from '@/components/common/Button/AiFilButton';

interface ArticleNavBarProps {
  onAddPhoto: () => void;
}

const ArticleNavBar = ({ onAddPhoto }: ArticleNavBarProps) => {
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
          <AiFilButton />
          <img src={AddTagIcon} alt="add tag icon" />
        </div>
      </div>
    </nav>
  );
};

export default ArticleNavBar;
