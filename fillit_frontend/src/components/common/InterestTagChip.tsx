import React from 'react';

interface InterestTagChipProps {
  tag: string;
  icon: string;
  onRemove: () => void;
}

const InterestTagChip: React.FC<InterestTagChipProps> = ({
  tag,
  icon,
  onRemove,
}) => {
  return (
    <div className="relative inline-flex items-center px-3 py-1 bg-white text-black rounded-full drop-shadow-lg mr-2 mb-2">
      <img src={icon} alt={`${tag} icon`} className="w-4 h-4 mr-1" />
      <span>{tag}</span>
      <button
        onClick={onRemove}
        className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs focus:outline-none"
        aria-label={`Remove ${tag}`}
      >
        X
      </button>
    </div>
  );
};

export default InterestTagChip;
