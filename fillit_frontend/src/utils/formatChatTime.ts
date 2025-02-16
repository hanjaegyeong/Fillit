export const formatChatTime = (date: string): string => {
  const createdDate = new Date(date);
  createdDate.setHours(createdDate.getHours() + 9);
  const now = new Date();

  const timeString = createdDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isSameDay = createdDate.toDateString() === now.toDateString();

  if (isSameDay) {
    return timeString;
  }

  const formattedDate = `${(createdDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${createdDate.getDate().toString().padStart(2, '0')}`;
  return `${formattedDate} ${timeString}`;
};
