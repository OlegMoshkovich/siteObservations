import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const session: Session | null = null;
  return (
    <NavigationContainer>
      <AppNavigator session={session} />
    </NavigationContainer>
  );
}
