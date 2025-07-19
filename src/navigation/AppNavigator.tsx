import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddScreen from '../screens/AddScreen';
import AccessScreen from '../screens/AccessScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Session } from '@supabase/supabase-js';
import { RouteProp } from '@react-navigation/native';
import { ParamListBase } from '@react-navigation/native';
import { Text } from 'react-native';
import { useUserStore } from '../state/slices/userSlice';
import { downloadPhoto, fetchObservationDates, fetchUserObservations } from '../utils/supabase';
import { useObservationStore } from '../state/slices/observationSlice';
import { TabNavigatorProps } from '../types/types';
const Tab = createBottomTabNavigator();

export default function TabNavigator({ session }: TabNavigatorProps) {
  const { user, setUser } = useUserStore();
  const { setObservationDates , setObservations, setPhotos } = useObservationStore();
  useEffect(() => {
    setUser(session?.user);
  }, [session]);

  useEffect(() => {
    if (!user?.id) return;
    const fatchData = async () => {
      const uniqueSortedDates = await fetchObservationDates(user.id);
      const observations= await fetchUserObservations(user?.id || ''  );
      const photosWithDataUrl = await Promise.all(
        (observations ?? []).map(async (photo: any) => {
          try {
            if (!photo.photo_url) {
              return { ...photo, dataUrl: null };
            }
            const fileData = await downloadPhoto(photo.photo_url);
            const fr = new FileReader();
            return await new Promise<any>((resolve) => {
              fr.onload = () => {
                resolve({ ...photo, dataUrl: fr.result as string });
              };
              fr.readAsDataURL(fileData);
            });
          } catch (e) {
            return { ...photo, dataUrl: null };
          }
        })
      );
      setObservationDates(uniqueSortedDates as string[]);
      setObservations(observations);
      setPhotos(photosWithDataUrl);
    };

    fatchData();
  }, [user?.id]);

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<ParamListBase, string> }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarIcon: ({ color, size }) => {
          let emoji = '';
          if (route.name === 'Add') {
            emoji = '📷';
          } else if (route.name === 'Library') {
            emoji = '🗂️';
          } else if (route.name === 'Profile') {
            emoji = '⚙️';
          }
          return (
            <Text
              style={{
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              role="img"
              aria-label={route.name}
            >
              {emoji}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Add">
        {() => <AddScreen />}
      </Tab.Screen>
      <Tab.Screen name="Library">
        {() => <AccessScreen />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <ProfileScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
} 