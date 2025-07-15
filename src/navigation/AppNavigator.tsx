import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddScreen from '../screens/AddScreen';
import AccessScreen from '../screens/AccessScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Session } from '@supabase/supabase-js';
import { RouteProp } from '@react-navigation/native';
import { ParamListBase } from '@react-navigation/native';
import { Text } from 'react-native';
const Tab = createBottomTabNavigator();

export default function TabNavigator({ session }: { session: Session | null }) {

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<ParamListBase, string> }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarIcon: ({ color, size }) => {
          let emoji = '';
          if (route.name === 'Add') {
            emoji = '➕';
          } else if (route.name === 'Access') {
            emoji = '🔍';
          } else if (route.name === 'Profile') {
            emoji = '👤';
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
      <Tab.Screen name="Access">
        {() => <AccessScreen />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <ProfileScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
} 