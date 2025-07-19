import { create } from 'zustand';
import { UIState } from '../../types';

export const useUIStore = create<UIState>((set) => ({
  selectedDate: null,
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  primaryColor: '#000000',
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  borderRadius: 0,
  setBorderRadius: (borderRadius) => set({ borderRadius }),
}));
