export const FADE_ANIMATION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6, delay: 0.3 },
};

export const SCALE_ANIMATION = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.6, delay: 0.2 },
};

export const BUTTON_ANIMATION = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.6, delay: 0.4 },
};

export const MODAL_BACKGROUND_ANIMATION = {
  initial: { opacity: 0, scale: 0.8, y: 100 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 100 },
  transition: {
    duration: 0.8,
    ease: [0.16, 1, 0.3, 1],
  },
};

export const MODAL_CONTENT_ANIMATION = {
  initial: { y: '60%', scale: 0.9, opacity: 0 },
  animate: { y: '40%', scale: 1, opacity: 1 },
  exit: { y: '60%', scale: 0.9, opacity: 0 },
  transition: {
    duration: 0.4,
    ease: 'easeOut',
  },
};
