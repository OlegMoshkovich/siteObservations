// IMPORTANT: Set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { formatObservationDate } from './dateUtils';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// --- Observation and Photo API helpers ---

export async function fetchUserObservations(userId: string) {
  if (!userId) throw new Error('User ID is required to fetch user observations');
  const { data, error } = await supabase
    .from('observations')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data || [];
}


export async function fetchObservationDates(userId: string) {
  const { data, error } = await supabase
    .from('observations')
    .select('created_at')
    .eq('user_id', userId);

  if (error) throw error;

  // Extract only the date part (YYYY-MM-DD) from each created_at, deduplicate, and sort descending
  const uniqueDateStrings = Array.from(
    new Set(
      (data ?? [])
        .map((item: any) => {
          // Extract only the date part (YYYY-MM-DD)
          if (!item.created_at) return null;
          return item.created_at.split('T')[0];
        })
        .filter(Boolean)
    )
  ).sort((a, b) => {
    const dateA = new Date(a as string);
    const dateB = new Date(b as string);
    return dateB.getTime() - dateA.getTime();
  });

  return uniqueDateStrings;
}

export async function insertObservation(observation: any) {
  const { data, error } = await supabase.from('observations').insert([observation]).select();
  if (error) throw error;
  return data && data[0];
}

export async function uploadPhoto( arrayBuffer: ArrayBuffer, filename: string) {
  const { data: uploadData, error: uploadError } = await supabase.storage
  .from('photos')
  .upload(filename, arrayBuffer, {
    contentType: 'image/jpeg',
  });
  if (uploadError) throw uploadError;
  return uploadData?.path || filename;
}

export async function downloadPhoto(photoUrl: string) {
  const { data: fileData, error } = await supabase.storage.from('photos').download(photoUrl);
  if (error || !fileData) throw error;
  return fileData;
}

export async function updateObservationPhotoUrl(observationId: string, photoUrl: string) {
  const { error } = await supabase.from('observations').update({ photo_url: photoUrl }).eq('id', observationId);
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}