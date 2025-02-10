import { formatDate } from '@/utils/formatDate';

interface TimeStampProps {
  date: string;
  size?: 'small' | 'large';
}

const TimeStamp = ({ date, size = 'large' }: TimeStampProps) => {
  return (
    <div
      className={`font-extralight ${
        size === 'large' ? 'text-xs' : 'text-small'
      }`}
    >
      {formatDate(date)}
    </div>
  );
};

export default TimeStamp;
