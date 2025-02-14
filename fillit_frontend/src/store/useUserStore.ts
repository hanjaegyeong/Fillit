import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  user: User;
  setUser: (user: User) => void;
  reset: () => void;
}

const initialUser: User = {
  type: 'user',
  id: '',
  name: '',
  personalId: '',
  profileImageUrl: '',
  introduction: '',
  birthDate: '',
  followersCount: 0,
  followingCount: 0,
  follow: false,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: initialUser,
      setUser: (user) => set({ user }),
      reset: () => set({ user: initialUser }),
    }),
    { name: 'user-info' }
  )
);
