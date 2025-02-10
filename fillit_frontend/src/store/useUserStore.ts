import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  user: Pick<User, 'personalId'>;
  setUser: (user: Pick<User, 'personalId'>) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        personalId: '',
      },
      setUser: (user) => set({ user }),
      reset: () => set({ user: { personalId: '' } }),
    }),
    { name: 'user-info' }
  )
);
