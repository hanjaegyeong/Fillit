import React from 'react';

interface TagButtonProps {
  id: number;
  label: string;
  icon: string;
  isSelected: boolean;
  onClick: (id: number) => void;
}

const TagButton: React.FC<TagButtonProps> = ({
  id,
  label,
  icon,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-full border text-xl transition-all flex items-center gap-2 ${
        isSelected
          ? 'bg-white text-black shadow-md'
          : 'bg-transparent border-gray-400 text-gray-600'
      }`}
    >
      <img src={icon} alt={label} className="w-6, h-6" />
      {label}
    </button>
  );
};

export default TagButton;
