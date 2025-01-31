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

const InterestTags = () => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((tag) => tag !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4 w-full max-w-[320px] mx-auto">
      {Tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => toggleTag(tag.id)}
          className={`px-4 py-2 rounded-full border text-sm transition-all ${
            selectedTags.includes(tag.id)
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
