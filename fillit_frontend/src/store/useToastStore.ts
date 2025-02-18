import { create } from 'zustand';

interface toastStore {
  toast: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
}

const useToastStore = create<toastStore>((set) => ({
  toast: null,
  showToast: (message: string) => {
    set((state) => ({ ...state, toast: message }));
  },
  hideToast: () => {
    set((state) => ({ ...state, toast: null }));
  },
}));

export default useToastStore;
