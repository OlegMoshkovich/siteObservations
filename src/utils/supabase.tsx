import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://euetokzwpljkjpwiypyk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZXRva3p3cGxqa2pwd2l5cHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MjQ2MjQsImV4cCI6MjA2ODAwMDYyNH0._70bzr5XfX9nVOKZBYHxlYgNBZ9WSgS-3T9Fl4mNwwo'
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})