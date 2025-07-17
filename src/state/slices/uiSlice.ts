import { create } from 'zustand';
import { UIState } from '../../types/types';

export const useUIStore = create<UIState>((set) => ({
  selectedDate: null,
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
