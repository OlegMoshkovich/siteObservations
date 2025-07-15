import { create } from 'zustand';

export interface UIState {
  selectedDate: string | null;
  setSelectedDate: (selectedDate: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedDate: null,
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
