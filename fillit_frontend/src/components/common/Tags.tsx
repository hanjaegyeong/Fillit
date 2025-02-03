import { useState } from 'react';

const Tags = [
  { id: 1, label: '🎵 Music' },
  { id: 2, label: '🐶 Pets' },
  { id: 3, label: '📅 Daily' },
  { id: 4, label: '💻 Tech' },
  { id: 5, label: '🏖️ Travel' },
  { id: 6, label: '🍔 Food' },
  { id: 7, label: '📚 Literature' },
  { id: 8, label: '📺 Entertainment' },
  { id: 9, label: '🎨 Art' },
  { id: 10, label: '🛍️ Fashion' },
  { id: 11, label: '🎞️ Movie' },
  { id: 12, label: '💄 Beauty' },
  { id: 13, label: '🎮 Games' },
  { id: 14, label: '📷 Photography' },
  { id: 15, label: '⚽ Sports' },
];

interface InterestTagsProps {
  singleSelect: boolean;
  onSelect: (tag: string) => void;
  selectedTag: string;
}

const InterestTags = ({
  singleSelect,
  onSelect,
  selectedTag,
}: InterestTagsProps) => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const toggleTag = (id: number) => {
    if (singleSelect) {
      setSelectedTags([id]);
      onSelect(Tags.find((tag) => tag.id === id)?.label || '');
    } else {
      setSelectedTags((prev) =>
        prev.includes(id) ? prev.filter((tag) => tag !== id) : [...prev, id]
      );
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 w-full max-w-[480px] mx-auto">
      {Tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => toggleTag(tag.id)}
          className={`px-3 py-1.5 rounded-full border text-lg transition-all ${
            (
              singleSelect
                ? tag.label === selectedTag
                : selectedTags.includes(tag.id)
            )
              ? 'bg-white text-black font-bold shadow-md'
              : 'bg-transparent border-gray-400 text-gray-600'
          }`}
        >
          {tag.label}
        </button>
      ))}
    </div>
  );
};

export default InterestTags;
