export const formatDate = (date: string): string => {
  const createdDate = new Date(date);
  createdDate.setHours(createdDate.getHours() + 9);
  const nowDate = new Date();

  const secondDiff = Math.floor(
    (nowDate.getTime() - createdDate.getTime()) / 1000
  );

  if (secondDiff < 60)
    return `${secondDiff} second${secondDiff === 1 ? '' : 's'} ago`;

  const minuteDiff = Math.floor(secondDiff / 60);

  if (minuteDiff < 60)
    return `${minuteDiff} minute${minuteDiff === 1 ? '' : 's'} ago`;

  const hourDiff = Math.floor(minuteDiff / 60);

  if (hourDiff < 24) return `${hourDiff} hour${hourDiff === 1 ? '' : 's'} ago`;

  const dayDiff = Math.floor(hourDiff / 24);

  if (dayDiff < 7) return `${dayDiff} day${dayDiff === 1 ? '' : 's'} ago`;

  const formattedDate =
    createdDate.toISOString().split('T')[0].replace(/-/g, '. ') + '.';

  return formattedDate;
};
