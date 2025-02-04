export const truncateText = (text: string, len: number) => {
  return text.length > len ? text.slice(0, len + 1) + '...' : text;
};
