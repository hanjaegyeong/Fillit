import AiFil from '@/assets/images/ai-fil.png';
import SlideUpModal from '../Modals/SlideUpModal';
import { useState } from 'react';

const AiFilButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <img src={AiFil} alt="ai-fil-img" />
      </button>
      <SlideUpModal open={isOpen} onClose={() => setIsOpen(false)}>
        {/* 이후 ai 컴포넌트 구현 필요 */}
        <h2 className="text-xl font-bold mb-4">Slide-Up Modal</h2>
        <p>This is a modal that slides up from the bottom.</p>
      </SlideUpModal>
    </>
  );
};

export default AiFilButton;
