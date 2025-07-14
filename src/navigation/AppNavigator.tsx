import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthScreen from '../screens/AuthScreen';
import AddScreen from '../screens/AddScreen';
import RetrieveScreen from '../screens/RetrieveScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Session } from '@supabase/supabase-js';
import { RouteProp } from '@react-navigation/native';
import { ParamListBase } from '@react-navigation/native';
const Tab = createBottomTabNavigator();

export default function TabNavigator({ session }: { session: Session | null }) {
  if (!session) {
    return <AuthScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<ParamListBase, string> }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'red',
      })}
    >
      <Tab.Screen name="Create">
        {() => <AddScreen />}
      </Tab.Screen>
      <Tab.Screen name="Retrieve">
        {() => <RetrieveScreen />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <ProfileScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
} 