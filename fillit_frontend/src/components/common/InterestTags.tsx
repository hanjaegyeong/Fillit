import { useState } from 'react';
import TagButton from '@/components/common/Button/TagButton';
import { INTEREST_TAGS } from '@/constants/interestTags';

const InterestTags = () => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((tag) => tag !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 w-full max-w-[390px] mx-auto">
      {INTEREST_TAGS.map((tag) => (
        <TagButton
          key={tag.id}
          id={tag.id}
          label={tag.label}
          icon={tag.icon}
          isSelected={selectedTags.includes(tag.id)}
          onClick={toggleTag}
        ></TagButton>
      ))}
    </div>
  );
};

export default InterestTags;
