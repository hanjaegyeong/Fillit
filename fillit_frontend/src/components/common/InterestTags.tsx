import TagButton from '@/components/common/Button/TagButton';
import { INTEREST_TAGS } from '@/constants/interestTags';

interface InterestTagsProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const InterestTags = ({ selectedTags, onChange }: InterestTagsProps) => {
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 w-full max-w-[390px] mx-auto">
      {INTEREST_TAGS.map((tag) => (
        <TagButton
          key={tag.id}
          id={tag.id}
          label={tag.label}
          icon={tag.icon}
          isSelected={selectedTags.includes(tag.label)}
          onClick={() => handleTagClick(tag.label)}
        />
      ))}
    </div>
  );
};

export default InterestTags;
