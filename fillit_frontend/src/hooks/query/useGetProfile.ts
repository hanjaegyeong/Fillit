import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/user';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useGetProfile = (personalId: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE, personalId],
    queryFn: () => {
      return getUserProfile(personalId ?? '');
    },
    enabled: !!personalId,
  });
};
