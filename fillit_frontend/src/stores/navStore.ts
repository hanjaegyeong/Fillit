import { create } from 'zustand';

interface NavStore {
  activeNavItem: string | null;
  setActiveNavItem: (item: string) => void;
}

const useNavStore = create<NavStore>((set) => ({
  activeNavItem: null,
  setActiveNavItem: (item) => set({ activeNavItem: item }),
}));

export default useNavStore;
