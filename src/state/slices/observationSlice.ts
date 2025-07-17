import { create } from 'zustand';
import { ObservationState } from '../../types';
import { Observation } from '../../types/supabase';

export const useObservationStore = create<ObservationState>((set) => ({
  observationDates: null,
  observations: null,
  photos: null,
  setObservationDates: (observationDates) => set({ observationDates }),
  setObservations: (observations: Observation[]) => set({ observations }),
  clearObservationDates: () => set({ observationDates: null }),
  setPhotos: (photos: Observation[]) => set({ photos }),
  
}));
