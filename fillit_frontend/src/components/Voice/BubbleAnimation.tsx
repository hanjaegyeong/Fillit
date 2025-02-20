import { motion } from 'framer-motion';
import { bubble1, bubble2, bubble3 } from '@/assets/assets';

interface BubbleAnimationProps {
  isVisible: boolean;
}

const BubbleAnimation = ({ isVisible }: BubbleAnimationProps) => {
  if (!isVisible) return null;

  const bubbles = [
    { src: bubble1, delay: 0, size: 'w-16 h-16' },
    { src: bubble2, delay: 0.2, size: 'w-12 h-12' },
    { src: bubble3, delay: 0.4, size: 'w-14 h-14' },
    { src: bubble1, delay: 0.6, size: 'w-10 h-10' },
    { src: bubble2, delay: 0.8, size: 'w-16 h-16' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none">
      {bubbles.map((bubble, index) => (
        <motion.img
          key={index}
          src={bubble.src}
          alt="bubble"
          className={`absolute ${bubble.size} opacity-80`}
          initial={{
            y: '100vh',
            x: `${Math.random() * 80 + 10}vw`,
            opacity: 0,
          }}
          animate={{
            y: '-20vh',
            opacity: [0, 1, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 3,
            delay: bubble.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

export default BubbleAnimation;
