export const formatChatTime = (date: string): string => {
  const createdDate = new Date(date);
  createdDate.setHours(createdDate.getHours() + 9);
  const now = new Date();

  let hours = createdDate.getHours();
  const isAM = hours < 12;
  if (hours > 12) hours -= 12;

  const timeString = `${isAM ? 'AM' : 'PM'} ${hours.toString()}:${createdDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const isSameDay = createdDate.toDateString() === now.toDateString();

  if (isSameDay) {
    return timeString;
  }

  const formattedDate = `${(createdDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${createdDate.getDate().toString().padStart(2, '0')}`;
  return `${formattedDate} ${timeString}`;
};
