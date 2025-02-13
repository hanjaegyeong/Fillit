import { formatDate } from '@/utils/formatDate';

interface TimeStampProps {
  date: string;
  size?: 'small' | 'large';
}

const TimeStamp = ({ date, size = 'large' }: TimeStampProps) => {
  return (
    <div
      className={`font-extralight whitespace-nowrap ${
        size === 'large' ? 'text-s' : 'text-xs'
      }`}
    >
      {formatDate(date)}
    </div>
  );
};

export default TimeStamp;
