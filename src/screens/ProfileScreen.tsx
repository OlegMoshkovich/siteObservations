import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabase';
import Button from '../components/UI/Button';
import { useObservationStore } from '../state/slices/observationSlice';
import { useUserStore } from '../state/slices/userSlice';

export default function ProfileScreen() {
  const { setObservationDates, setObservations, setPhotos } = useObservationStore();
  const { setUser } = useUserStore();
  const [signingOut, setSigningOut] = useState(false);
  
  async function handleSignOut() {
    setSigningOut(true)
    setObservationDates([]);
    setUser(null);
    setObservations([]);
    setPhotos([]);
    await supabase.auth.signOut()
    setSigningOut(false)
  }

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={() => {handleSignOut()}} />   
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});