import { getFormattedDate } from '@/utils/getFormattedDate';

interface TimeStampProps {
  date: string;
}

const TimeStamp = ({ date }: TimeStampProps) => {
  return (
    <div className="font-extralight text-xs">{getFormattedDate(date)}</div>
  );
};

export default TimeStamp;
