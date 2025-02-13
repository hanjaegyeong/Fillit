export const truncateText = (text: string | null, len: number) => {
  if (!text) return '';
  return text.length > len ? text.slice(0, len + 1) + '...' : text;
};
