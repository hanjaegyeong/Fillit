import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

interface Interest {
  id: number;
  name: string;
  // ... 다른 필요한 타입 정의
}

const fetchInterests = async (): Promise<Interest[]> => {
  const { data } = await axiosInstance.get('/api/interests');
  return data;
};

export const useGetInterests = () => {
  return useQuery({
    queryKey: ['interests'],
    queryFn: fetchInterests,
    staleTime: 5 * 60 * 1000, // 5분동안 fresh 상태 유지
  });
};
