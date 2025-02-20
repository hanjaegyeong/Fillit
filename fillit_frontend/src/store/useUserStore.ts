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
  followerCount: 0,
  followeeCount: 0,
  follow: false,
  interests: [],
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
