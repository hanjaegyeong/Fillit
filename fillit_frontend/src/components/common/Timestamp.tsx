import { getFormattedDate } from '@/utils/getFormattedDate';

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
      {getFormattedDate(date)}
    </div>
  );
};

export default TimeStamp;
