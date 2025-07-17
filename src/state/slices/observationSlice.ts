import { create } from 'zustand';
import { ObservationState } from '../../types/types';

export const useObservationStore = create<ObservationState>((set) => ({
  observationDates: null,
  observations: null,
  photos: null,
  setObservationDates: (observationDates) => set({ observationDates }),
  setObservations: (observations: any[]) => set({ observations }),
  clearObservationDates: () => set({ observationDates: null }),
  setPhotos: (photos: any[]) => set({ photos }),
  
}));
