import React from 'react';
import { DeleteRedIcon } from '@/assets/assets';

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
      <button onClick={onRemove} aria-label={`Remove ${tag}`}>
        <img
          src={DeleteRedIcon}
          className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-5 h-5 "
        />
      </button>
    </div>
  );
};

export default InterestTagChip;
