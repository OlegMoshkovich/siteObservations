import { create } from 'zustand';
import { supabase } from '../../utils/supabase';

export interface Observation {
  id: string;
  photo_url?: string | null;
  [key: string]: any;
}

export interface PhotoData {
  dataUrl: string | null;
}

interface ObservationState {
  observations: Observation[];
  photos: Record<string, PhotoData>;
  isLoadingObservations: boolean;
  isLoadingPhotos: boolean;
  fetchAllObservations: () => Promise<void>;
  fetchPhotosForObservations: () => Promise<void>;
  addObservation: (observation: Observation, imageFile?: File | Blob) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useObservationStore = create<ObservationState>((set, get) => ({
  observations: [],
  photos: {},
  isLoadingObservations: false,
  isLoadingPhotos: false,

  fetchAllObservations: async () => {
    set({ isLoadingObservations: true });
    try {
      const { data, error } = await supabase.from('observations').select('*');
      if (error) throw error;
      set({ observations: data || [] });
    } catch (err) {
      console.error('Error fetching observations:', err);
      set({ observations: [] });
    } finally {
      set({ isLoadingObservations: false });
    }
  },

  fetchPhotosForObservations: async () => {
    set({ isLoadingPhotos: true });
    try {
      const { observations } = get();
      const photos: Record<string, PhotoData> = {};
      await Promise.all(
        observations.map(async (obs) => {
          if (obs.photo_url) {
            try {
              const { data: fileData, error: fileError } = await supabase.storage.from('photos').download(obs.photo_url);
              if (fileError || !fileData) {
                photos[obs.id] = { dataUrl: null };
                return;
              }
              const fr = new FileReader();
              photos[obs.id] = await new Promise<PhotoData>((resolve) => {
                fr.onload = () => resolve({ dataUrl: fr.result as string });
                fr.onerror = () => resolve({ dataUrl: null });
                fr.readAsDataURL(fileData);
              });
            } catch (e) {
              photos[obs.id] = { dataUrl: null };
            }
          }
        })
      );
      set({ photos });
    } catch (err) {
      console.error('Error fetching photos:', err);
      set({ photos: {} });
    } finally {
      set({ isLoadingPhotos: false });
    }
  },

  addObservation: async (observation, imageFile) => {
    set((state) => ({ observations: [...state.observations, observation] }));
    try {
      // Insert observation into Supabase
      const { data, error } = await supabase.from('observations').insert([observation]).select();
      if (error) throw error;
      const inserted = data && data[0];
      if (inserted && imageFile) {
        // Upload photo to storage if imageFile provided
        const filePath = `${inserted.id}/${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from('photos').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        // Update observation with photo_url
        await supabase.from('observations').update({ photo_url: filePath }).eq('id', inserted.id);
        // Fetch and store dataUrl
        const { data: fileData, error: fileError } = await supabase.storage.from('photos').download(filePath);
        if (!fileError && fileData) {
          const fr = new FileReader();
          fr.onload = () => {
            set((state) => ({
              photos: { ...state.photos, [inserted.id]: { dataUrl: fr.result as string } },
            }));
          };
          fr.readAsDataURL(fileData);
        }
      }
    } catch (err) {
      console.error('Error adding observation:', err);
    }
  },

  hydrate: async () => {
    await get().fetchAllObservations();
    await get().fetchPhotosForObservations();
  },
})); 