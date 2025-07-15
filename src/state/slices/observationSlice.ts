import { create } from 'zustand';

export interface ObservationState {
  observationDates: string[] | null;
  observations: any[] | null;
  setObservationDates: (observationDates: string[]) => void;
  setObservations: (observations: any[]) => void;
  clearObservationDates: () => void;
  photos: any[] | null;
  setPhotos: (photos: any[]) => void;
}

export const useObservationStore = create<ObservationState>((set) => ({
  observationDates: null,
  observations: null,
  photos: null,
  setObservationDates: (observationDates) => set({ observationDates }),
  setObservations: (observations: any[]) => set({ observations }),
  clearObservationDates: () => set({ observationDates: null }),
  setPhotos: (photos: any[]) => set({ photos }),
  
}));
