import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabase';
import Button from '../components/UI/Button';
import CircleButton from '../components/UI/CircleButton';
import { useObservationStore } from '../state/slices/observationSlice';
import { useUserStore } from '../state/slices/userSlice';
import { useUIStore } from '../state/slices/uiSlice';
import Slider from '@react-native-community/slider';    

export default function ProfileScreen() {
  const { setObservationDates, setObservations, setPhotos } = useObservationStore();
  const { user, setUser } = useUserStore();
  const { setPrimaryColor, borderRadius, setBorderRadius } = useUIStore();
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
      <View style={styles.elementsContainer}>
     
      <Text >{user?.email}</Text>
      <Button title="Logout" onPress={() => {handleSignOut()}} />      

         <View style={styles.themeContainer}>
          <View style={styles.circleButtonsContainer}>
            <CircleButton 
              color="#000000" 
              onPress={() => setPrimaryColor('#000000')} 
              size={30}
            />
            <CircleButton 
              color="#4CAF50" 
              onPress={() => setPrimaryColor('#4CAF50')} 
              size={30}
            />
            <CircleButton 
              color="#2196F3" 
              onPress={() => setPrimaryColor('#2196F3')} 
              size={30}
            />
          </View>
          <Slider
            style={{width: 200, height: 40, paddingTop:30}}
            minimumValue={0}
            maximumValue={50}
            value={borderRadius}
            onValueChange={(value) => setBorderRadius(value)}
            minimumTrackTintColor={useUIStore.getState().primaryColor}
            maximumTrackTintColor="#CCCCCC"
            thumbTintColor={useUIStore.getState().primaryColor}
          />
        </View>
      </View>
      
    
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
  elementsContainer: {
    height: '40%',
    width: '50%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  
  themeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',

    height: 90,
  },
});