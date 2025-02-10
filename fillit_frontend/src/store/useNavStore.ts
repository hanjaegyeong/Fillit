import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface NavStore {
  activeNavItem: string;
  setActiveNavItem: (item: string) => void;
}

const useNavStore = create<NavStore>()(
  persist(
    (set) => ({
      activeNavItem: 'home',
      setActiveNavItem: (item) => set({ activeNavItem: item }),
    }),
    {
      name: 'nav-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useNavStore;
